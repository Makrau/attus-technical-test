require "rails_helper"

RSpec.describe Movie, type: :model do
  describe "associations" do
    it { should have_many(:sessions).dependent(:destroy) }
  end

  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:director) }
    it { should validate_numericality_of(:duration).is_greater_than(0) }
  end

  describe "validations - success cases" do
    it "is valid with all required attributes" do
      movie = build(:movie)
      expect(movie).to be_valid
    end

    it "is valid without synopsis (optional field)" do
      movie = build(:movie, synopsis: nil)
      expect(movie).to be_valid
    end

    it "is valid with minimum duration (1 minute)" do
      movie = build(:movie, duration: 1)
      expect(movie).to be_valid
    end

    it "is valid with very long duration" do
      movie = build(:movie, duration: 999_999)
      expect(movie).to be_valid
    end
  end

  describe "validations - failure cases" do
    it "is invalid without title" do
      movie = build(:movie, title: nil)
      expect(movie).not_to be_valid
      expect(movie.errors[:title]).to include("can't be blank")
    end

    it "is invalid with empty title" do
      movie = build(:movie, title: "")
      expect(movie).not_to be_valid
      expect(movie.errors[:title]).to include("can't be blank")
    end

    it "is invalid without director" do
      movie = build(:movie, director: nil)
      expect(movie).not_to be_valid
      expect(movie.errors[:director]).to include("can't be blank")
    end

    it "is invalid with empty director" do
      movie = build(:movie, director: "")
      expect(movie).not_to be_valid
      expect(movie.errors[:director]).to include("can't be blank")
    end

    it "is invalid without duration" do
      movie = build(:movie, duration: nil)
      expect(movie).not_to be_valid
      expect(movie.errors[:duration]).to include("is not a number")
    end

    it "is invalid with zero duration" do
      movie = build(:movie, duration: 0)
      expect(movie).not_to be_valid
      expect(movie.errors[:duration]).to include("must be greater than 0")
    end

    it "is invalid with negative duration" do
      movie = build(:movie, duration: -10)
      expect(movie).not_to be_valid
      expect(movie.errors[:duration]).to include("must be greater than 0")
    end

    it "is invalid with non-numeric duration" do
      movie = build(:movie, duration: "invalid")
      expect(movie).not_to be_valid
      expect(movie.errors[:duration]).to include("is not a number")
    end
  end

  describe "dependent associations" do
    it "destroys associated sessions when movie is destroyed" do
      movie = create(:movie)
      room = create(:room)
      session = create(:session, movie: movie, room: room)

      expect { movie.destroy }.to change { Session.count }.by(-1)
    end
  end
end
