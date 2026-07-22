require "rails_helper"

RSpec.describe Room, type: :model do
  describe "associations" do
    it { should have_many(:sessions).dependent(:destroy) }
  end

  describe "validations" do
    it { should validate_presence_of(:number) }
    it { should validate_numericality_of(:number).is_greater_than(0) }

    # Para uniqueness, precisamos criar um registro antes do teste
    context "uniqueness validation" do
      subject { build(:room) }
      it { should validate_uniqueness_of(:number) }
    end
  end

  describe "validations - success cases" do
    it "is valid with a valid number" do
      room = build(:room, number: 5)
      expect(room).to be_valid
    end

    it "is valid with number 1" do
      room = build(:room, number: 1)
      expect(room).to be_valid
    end

    it "is valid with a large number" do
      room = build(:room, number: 999)
      expect(room).to be_valid
    end
  end

  describe "validations - failure cases" do
    it "is invalid without number" do
      room = build(:room, number: nil)
      expect(room).not_to be_valid
      expect(room.errors[:number]).to include("can't be blank")
    end

    it "is invalid with zero number" do
      room = build(:room, number: 0)
      expect(room).not_to be_valid
      expect(room.errors[:number]).to include("must be greater than 0")
    end

    it "is invalid with negative number" do
      room = build(:room, number: -5)
      expect(room).not_to be_valid
      expect(room.errors[:number]).to include("must be greater than 0")
    end

    it "is invalid with non-numeric number" do
      room = build(:room, number: "abc")
      expect(room).not_to be_valid
      expect(room.errors[:number]).to include("is not a number")
    end

    it "is invalid with duplicate number" do
      create(:room, number: 10)
      duplicate_room = build(:room, number: 10)

      expect(duplicate_room).not_to be_valid
      expect(duplicate_room.errors[:number]).to include("has already been taken")
    end

    it "is invalid with decimal number" do
      room = build(:room, number: 5.5)
      expect(room).not_to be_valid
      expect(room.errors[:number]).to include("must be an integer")
    end
  end

  describe "dependent associations" do
    it "destroys associated sessions when room is destroyed" do
      room = create(:room)
      movie = create(:movie)
      session = create(:session, movie: movie, room: room)

      expect { room.destroy }.to change { Session.count }.by(-1)
    end

    it "can be destroyed when it has no sessions" do
      room = create(:room)
      expect { room.destroy }.not_to raise_error
    end
  end
end
