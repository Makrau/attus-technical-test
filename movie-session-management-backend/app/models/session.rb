class Session < ApplicationRecord
  belongs_to :room
  belongs_to :movie

  before_validation :set_ends_at
  validates_with NoOverlappingSessionValidator

  private

  def set_ends_at
    return if starts_at.blank? || movie.blank?

    self.ends_at = starts_at + movie.duration.minutes
  end
end
