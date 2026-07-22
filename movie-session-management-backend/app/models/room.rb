class Room < ApplicationRecord
  validates :number, presence: true, numericality: { greater_than: 0, only_integer: true }, uniqueness: true

  has_many :sessions, dependent: :destroy
end
