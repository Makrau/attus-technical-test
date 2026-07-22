require "rails_helper"

RSpec.describe Session, type: :model do
  describe "associations" do
    it { should belong_to(:movie) }
    it { should belong_to(:room) }
  end

  describe "validations" do
    it { should validate_presence_of(:starts_at) }
  end

  describe "callbacks" do
    describe "#set_ends_at" do
      it "automatically calculates ends_at based on movie duration" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie = create(:movie, duration: 120)
          room = create(:room)
          starts_at = 2.hours.from_now

          session = build(:session, movie: movie, room: room, starts_at: starts_at)
          session.valid?

          expect(session.ends_at).to eq(starts_at + 120.minutes)
        end
      end

      it "recalculates ends_at when movie changes" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie1 = create(:movie, duration: 90)
          movie2 = create(:movie, duration: 150)
          room = create(:room)
          starts_at = 2.hours.from_now

          session = create(:session, movie: movie1, room: room, starts_at: starts_at)
          expect(session.ends_at).to eq(starts_at + 90.minutes)

          session.movie = movie2
          session.valid?
          expect(session.ends_at).to eq(starts_at + 150.minutes)
        end
      end

      it "recalculates ends_at when starts_at changes" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie = create(:movie, duration: 120)
          room = create(:room)
          starts_at1 = 2.hours.from_now
          starts_at2 = 4.hours.from_now

          session = create(:session, movie: movie, room: room, starts_at: starts_at1)
          expect(session.ends_at).to eq(starts_at1 + 120.minutes)

          session.starts_at = starts_at2
          session.valid?
          expect(session.ends_at).to eq(starts_at2 + 120.minutes)
        end
      end

      it "does not set ends_at if starts_at is blank" do
        movie = create(:movie)
        room = create(:room)
        session = build(:session, movie: movie, room: room, starts_at: nil)

        session.valid?
        expect(session.ends_at).to be_nil
      end

      it "does not set ends_at if movie is blank" do
        room = create(:room)
        starts_at = 2.hours.from_now
        session = build(:session, movie: nil, room: room, starts_at: starts_at)

        session.valid?
        expect(session.ends_at).to be_nil
      end
    end
  end

  describe "validations - success cases" do
    it "is valid with all required attributes" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        session = build(:session, starts_at: 2.hours.from_now)
        expect(session).to be_valid
      end
    end

    it "is valid with starts_at exactly 30 minutes from now" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        session = build(:session, starts_at: 30.minutes.from_now)
        expect(session).to be_valid
      end
    end

    it "is valid with starts_at more than 30 minutes from now" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        session = build(:session, starts_at: 5.days.from_now)
        expect(session).to be_valid
      end
    end

    it "allows multiple sessions in different rooms at the same time" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        movie = create(:movie)
        room1 = create(:room, number: 1)
        room2 = create(:room, number: 2)
        starts_at = 2.hours.from_now

        session1 = create(:session, movie: movie, room: room1, starts_at: starts_at)
        session2 = build(:session, movie: movie, room: room2, starts_at: starts_at)

        expect(session2).to be_valid
      end
    end
  end

  describe "validations - failure cases" do
    describe "starts_at presence" do
      it "is invalid without starts_at" do
        session = build(:session, starts_at: nil)
        expect(session).not_to be_valid
        expect(session.errors[:starts_at]).to include("can't be blank")
      end
    end

    describe "starts_at timing validations" do
      it "is invalid if starts_at is in the past" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session = build(:session, starts_at: 1.hour.ago)
          expect(session).not_to be_valid
          expect(session.errors[:starts_at]).to include("cannot be in the past")
        end
      end

      it "is invalid if starts_at is less than 30 minutes from now" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session = build(:session, starts_at: 29.minutes.from_now)
          expect(session).not_to be_valid
          expect(session.errors[:starts_at]).to include("must be at least 30 minutes from now")
        end
      end

      it "is invalid if starts_at is exactly now" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session = build(:session, starts_at: Time.current)
          expect(session).not_to be_valid
          expect(session.errors[:starts_at]).to include("must be at least 30 minutes from now")
        end
      end

      it "is invalid if starts_at is 1 minute from now" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session = build(:session, starts_at: 1.minute.from_now)
          expect(session).not_to be_valid
          expect(session.errors[:starts_at]).to include("must be at least 30 minutes from now")
        end
      end
    end

    describe "required associations" do
      it "is invalid without movie" do
        session = build(:session, movie: nil)
        expect(session).not_to be_valid
        expect(session.errors[:movie]).to include("must exist")
      end

      it "is invalid without room" do
        session = build(:session, room: nil)
        expect(session).not_to be_valid
        expect(session.errors[:room]).to include("must exist")
      end
    end
  end

  describe "edge cases" do
    it "handles sessions scheduled far in the future" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        session = build(:session, starts_at: 1.year.from_now)
        expect(session).to be_valid
      end
    end

    it "handles very short movies (1 minute)" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        movie = create(:movie, duration: 1)
        room = create(:room)
        starts_at = 2.hours.from_now

        session = create(:session, movie: movie, room: room, starts_at: starts_at)
        expect(session.ends_at).to eq(starts_at + 1.minute)
      end
    end

    it "handles very long movies (300 minutes)" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        movie = create(:movie, duration: 300)
        room = create(:room)
        starts_at = 2.hours.from_now

        session = create(:session, movie: movie, room: room, starts_at: starts_at)
        expect(session.ends_at).to eq(starts_at + 300.minutes)
      end
    end
  end

  describe "update scenarios" do
    it "can update starts_at of an existing session" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        session = create(:session, starts_at: 2.hours.from_now)
        new_starts_at = 5.hours.from_now

        session.starts_at = new_starts_at
        expect(session).to be_valid
        expect(session.save).to be true
      end
    end

    it "can change the room of an existing session" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        room1 = create(:room, number: 1)
        room2 = create(:room, number: 2)
        session = create(:session, room: room1, starts_at: 2.hours.from_now)

        session.room = room2
        expect(session).to be_valid
        expect(session.save).to be true
      end
    end

    it "can change the movie of an existing session and recalculates ends_at" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        movie1 = create(:movie, duration: 90)
        movie2 = create(:movie, duration: 150)
        starts_at = 2.hours.from_now
        session = create(:session, movie: movie1, starts_at: starts_at)

        original_ends_at = session.ends_at
        session.movie = movie2
        session.save!

        expect(session.ends_at).not_to eq(original_ends_at)
        expect(session.ends_at).to eq(starts_at + 150.minutes)
      end
    end
  end
end
