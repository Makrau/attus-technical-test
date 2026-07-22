require "rails_helper"

RSpec.describe NoOverlappingSessionValidator, type: :validator do
  describe "#validate" do
    let(:room) { create(:room) }
    let(:movie) { create(:movie, duration: 120) }

    context "when session is valid (no overlapping)" do
      it "allows sessions in the same room with no time overlap" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          # First session: 14:00 - 16:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Second session: 17:00 - 19:00 (no overlap)
          session2 = build(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 17, 0, 0))
          expect(session2).to be_valid
        end
      end

      it "allows sessions that end exactly when another begins (same room)" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          # First session: 14:00 - 16:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Second session starts exactly when first ends: 16:00 - 18:00
          session2 = build(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 16, 0, 0))
          expect(session2).to be_valid
        end
      end

      it "allows sessions in different rooms at the same time" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          room1 = create(:room, number: 1)
          room2 = create(:room, number: 2)
          starts_at = Time.zone.local(2026, 7, 25, 14, 0, 0)

          # Session in room 1
          create(:session, room: room1, movie: movie, starts_at: starts_at)

          # Session in room 2 at the exact same time
          session2 = build(:session, room: room2, movie: movie, starts_at: starts_at)
          expect(session2).to be_valid
        end
      end

      it "allows updating an existing session without collision with itself" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session = create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Update the same session (should not collide with itself)
          session.starts_at = Time.zone.local(2026, 7, 25, 14, 30, 0)
          expect(session).to be_valid
        end
      end

      it "allows multiple sessions in same room at different non-overlapping times" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          # Session 1: 14:00 - 16:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Session 2: 16:00 - 18:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 16, 0, 0))

          # Session 3: 18:00 - 20:00
          session3 = build(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 18, 0, 0))
          expect(session3).to be_valid
        end
      end
    end

    context "when session overlaps (invalid cases)" do
      it "rejects sessions with exact same time in same room" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          starts_at = Time.zone.local(2026, 7, 25, 14, 0, 0)
          create(:session, room: room, movie: movie, starts_at: starts_at)

          # Try to create another session at the exact same time
          session2 = build(:session, room: room, movie: movie, starts_at: starts_at)
          expect(session2).not_to be_valid
          expect(session2.errors[:base]).to include("There is already a session in this room at that time")
        end
      end

      it "rejects sessions that start during an existing session" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          # First session: 14:00 - 16:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Second session starts at 15:00 (during first session)
          session2 = build(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 15, 0, 0))
          expect(session2).not_to be_valid
          expect(session2.errors[:base]).to include("There is already a session in this room at that time")
        end
      end

      it "rejects sessions that end during an existing session" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie_long = create(:movie, duration: 180)

          # First session: 14:00 - 16:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Second session: 13:00 - 16:00 (ends during first session)
          session2 = build(:session, room: room, movie: movie_long, starts_at: Time.zone.local(2026, 7, 25, 13, 0, 0))
          expect(session2).not_to be_valid
          expect(session2.errors[:base]).to include("There is already a session in this room at that time")
        end
      end

      it "rejects sessions that completely contain an existing session" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie_short = create(:movie, duration: 60)
          movie_long = create(:movie, duration: 300)

          # First session (short): 15:00 - 16:00
          create(:session, room: room, movie: movie_short, starts_at: Time.zone.local(2026, 7, 25, 15, 0, 0))

          # Second session (long): 14:00 - 19:00 (contains first session)
          session2 = build(:session, room: room, movie: movie_long, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))
          expect(session2).not_to be_valid
          expect(session2.errors[:base]).to include("There is already a session in this room at that time")
        end
      end

      it "rejects sessions that start 1 minute before existing session ends" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          # First session: 14:00 - 16:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Second session starts at 15:59 (1 minute before first ends)
          session2 = build(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 15, 59, 0))
          expect(session2).not_to be_valid
          expect(session2.errors[:base]).to include("There is already a session in this room at that time")
        end
      end

      it "rejects partial overlap at the beginning" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie_long = create(:movie, duration: 180)

          # First session: 14:00 - 16:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Second session: 13:00 - 16:00 (overlaps at beginning)
          session2 = build(:session, room: room, movie: movie_long, starts_at: Time.zone.local(2026, 7, 25, 13, 0, 0))
          expect(session2).not_to be_valid
          expect(session2.errors[:base]).to include("There is already a session in this room at that time")
        end
      end

      it "rejects partial overlap at the end" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie_long = create(:movie, duration: 180)

          # First session: 14:00 - 16:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Second session: 15:00 - 18:00 (overlaps at end)
          session2 = build(:session, room: room, movie: movie_long, starts_at: Time.zone.local(2026, 7, 25, 15, 0, 0))
          expect(session2).not_to be_valid
          expect(session2.errors[:base]).to include("There is already a session in this room at that time")
        end
      end
    end

    context "when updating existing sessions" do
      it "allows updating a session to a non-overlapping time" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          # Session 1: 14:00 - 16:00
          session1 = create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Session 2: 17:00 - 19:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 17, 0, 0))

          # Update session 1 to 20:00 - 22:00 (no overlap)
          session1.starts_at = Time.zone.local(2026, 7, 25, 20, 0, 0)
          expect(session1).to be_valid
        end
      end

      it "rejects updating a session to an overlapping time" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          # Session 1: 14:00 - 16:00
          session1 = create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Session 2: 17:00 - 19:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 17, 0, 0))

          # Try to update session 1 to 18:00 (overlaps with session 2)
          session1.starts_at = Time.zone.local(2026, 7, 25, 18, 0, 0)
          expect(session1).not_to be_valid
          expect(session1.errors[:base]).to include("There is already a session in this room at that time")
        end
      end

      it "allows updating movie (and thus duration) without time overlap" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie_short = create(:movie, duration: 90)
          movie_long = create(:movie, duration: 150)

          # Session 1: 14:00 - 15:30 (90 min)
          session1 = create(:session, room: room, movie: movie_short, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Session 2: 17:00 - 19:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 17, 0, 0))

          # Update session 1 movie to longer (14:00 - 16:30), still no overlap
          session1.movie = movie_long
          expect(session1).to be_valid
        end
      end

      it "rejects updating movie when new duration causes overlap" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie_short = create(:movie, duration: 90)
          movie_long = create(:movie, duration: 240)

          # Session 1: 14:00 - 15:30 (90 min)
          session1 = create(:session, room: room, movie: movie_short, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Session 2: 17:00 - 19:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 17, 0, 0))

          # Update session 1 movie to very long (14:00 - 18:00), causes overlap
          session1.movie = movie_long
          expect(session1).not_to be_valid
          expect(session1.errors[:base]).to include("There is already a session in this room at that time")
        end
      end
    end

    context "edge cases with validator" do
      it "does not validate if starts_at is blank" do
        session = build(:session, room: room, movie: movie, starts_at: nil)
        # Will be invalid due to presence validation, but validator should not add overlap error
        session.valid?
        expect(session.errors[:base]).not_to include("There is already a session in this room at that time")
      end

      it "does not validate if ends_at is blank" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session = build(:session, room: room, movie: nil, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))
          session.valid?
          # ends_at will be nil because movie is nil
          expect(session.errors[:base]).not_to include("There is already a session in this room at that time")
        end
      end

      it "does not validate if room_id is blank" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session = build(:session, room: nil, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))
          session.valid?
          expect(session.errors[:base]).not_to include("There is already a session in this room at that time")
        end
      end
    end

    context "complex scenarios with multiple sessions" do
      it "correctly validates when there are multiple non-overlapping sessions in the same room" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          # Create 3 sessions in the same room
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0)) # 14:00-16:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 16, 0, 0)) # 16:00-18:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 18, 0, 0)) # 18:00-20:00

          # Try to add a 4th session that doesn't overlap
          session4 = build(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 20, 0, 0))
          expect(session4).to be_valid
        end
      end

      it "correctly rejects when trying to fit a session between two existing sessions with insufficient gap" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie_long = create(:movie, duration: 150)

          # Session 1: 14:00-16:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Session 2: 17:00-19:00
          create(:session, room: room, movie: movie, starts_at: Time.zone.local(2026, 7, 25, 17, 0, 0))

          # Try to fit a long session between them: 15:00-17:30 (overlaps with both)
          session3 = build(:session, room: room, movie: movie_long, starts_at: Time.zone.local(2026, 7, 25, 15, 0, 0))
          expect(session3).not_to be_valid
          expect(session3.errors[:base]).to include("There is already a session in this room at that time")
        end
      end
    end
  end
end
