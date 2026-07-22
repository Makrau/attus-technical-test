FactoryBot.define do
  factory :movie do
    title { Faker::Movie.title }
    director { Faker::Name.name }
    duration { 120 }
    synopsis { Faker::Lorem.paragraph(sentence_count: 3) }

    trait :without_synopsis do
      synopsis { nil }
    end

    trait :short_duration do
      duration { 90 }
    end

    trait :long_duration do
      duration { 180 }
    end
  end
end
