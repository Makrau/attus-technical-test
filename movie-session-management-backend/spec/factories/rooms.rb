FactoryBot.define do
  factory :room do
    sequence(:number) { |n| n }
  end
end
