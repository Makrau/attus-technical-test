class Movie < ApplicationRecord
  validates :title, presence: true
  validates :director, presence: true
  validates :duration, numericality: { greater_than: 0 }
end
