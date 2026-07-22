FactoryBot.define do
  factory :session do
    association :movie
    association :room
    starts_at { 2.hours.from_now.change(min: 0, sec: 0) }

    trait :tomorrow_afternoon do
      starts_at { 1.day.from_now.change(hour: 14, min: 0, sec: 0) }
    end

    trait :tomorrow_evening do
      starts_at { 1.day.from_now.change(hour: 20, min: 0, sec: 0) }
    end
  end
end
