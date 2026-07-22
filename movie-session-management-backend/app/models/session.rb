class Session < ApplicationRecord
  belongs_to :room
  belongs_to :movie

  validates :starts_at, presence: true
  validate :starts_at_cannot_be_in_the_past
  validate :starts_at_must_be_at_least_30_minutes_ahead

  before_validation :set_ends_at
  validates_with NoOverlappingSessionValidator

  private

  def set_ends_at
    return if starts_at.blank? || movie.blank?

    self.ends_at = starts_at + movie.duration.minutes
  end

  def starts_at_cannot_be_in_the_past
    return if starts_at.blank?

    if starts_at < Time.current
      errors.add(:starts_at, "cannot be in the past")
    end
  end

  def starts_at_must_be_at_least_30_minutes_ahead
    return if starts_at.blank?

    if starts_at < 30.minutes.from_now
      errors.add(:starts_at, "must be at least 30 minutes from now")
    end
  end
end
