require "rails_helper"

RSpec.describe "/sessions", type: :request do
  let(:movie) { create(:movie, duration: 120) }
  let(:room) { create(:room) }

  describe "GET /index" do
    it "renders a successful response" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        create(:session, movie: movie, room: room, starts_at: 2.hours.from_now)
        get sessions_url, as: :json
        expect(response).to be_successful
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    it "returns all sessions" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        room1 = create(:room, number: 1)
        room2 = create(:room, number: 2)
        session1 = create(:session, movie: movie, room: room1, starts_at: 2.hours.from_now)
        session2 = create(:session, movie: movie, room: room2, starts_at: 3.hours.from_now)

        get sessions_url, as: :json

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json.length).to eq(2)
        expect(json.map { |s| s["id"] }).to contain_exactly(session1.id, session2.id)
      end
    end

    it "returns empty array when no sessions exist" do
      get sessions_url, as: :json
      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq([])
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        session = create(:session, movie: movie, room: room, starts_at: 2.hours.from_now)
        get session_url(session), as: :json
        expect(response).to be_successful
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    it "returns the session with all attributes including calculated ends_at" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        starts_at = 2.hours.from_now
        session = create(:session, movie: movie, room: room, starts_at: starts_at)
        get session_url(session), as: :json

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["id"]).to eq(session.id)
        expect(json["movie_id"]).to eq(movie.id)
        expect(json["room_id"]).to eq(room.id)
        expect(Time.zone.parse(json["starts_at"])).to be_within(1.second).of(starts_at)
        expect(Time.zone.parse(json["ends_at"])).to be_within(1.second).of(starts_at + 120.minutes)
      end
    end

    it "returns 404 when session does not exist" do
      get session_url(id: "non-existent-uuid"), as: :json
      expect(response).to have_http_status(:not_found)
      json = response.parsed_body
      expect(json["error"]).to be_present
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Session" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          valid_attributes = {
            session: {
              starts_at: 2.hours.from_now.iso8601,
              movie_id: movie.id,
              room_id: room.id
            }
          }
          expect {
            post sessions_url, params: valid_attributes, as: :json
          }.to change(Session, :count).by(1)
        end
      end

      it "renders a JSON response with the new session" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          valid_attributes = {
            session: {
              starts_at: 2.hours.from_now.iso8601,
              movie_id: movie.id,
              room_id: room.id
            }
          }
          post sessions_url, params: valid_attributes, as: :json
          expect(response).to have_http_status(:created)
          expect(response.content_type).to match(a_string_including("application/json"))

          json = response.parsed_body
          expect(json["movie_id"]).to eq(movie.id)
          expect(json["room_id"]).to eq(room.id)
          expect(json["ends_at"]).to be_present
        end
      end

      it "automatically calculates ends_at based on movie duration" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          starts_at = 2.hours.from_now
          params = {
            session: {
              starts_at: starts_at.iso8601,
              movie_id: movie.id,
              room_id: room.id
            }
          }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:created)
          json = response.parsed_body
          expect(Time.zone.parse(json["ends_at"])).to be_within(1.second).of(starts_at + 120.minutes)
        end
      end

      it "creates session exactly 30 minutes from now (boundary case)" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          starts_at = 30.minutes.from_now
          params = {
            session: {
              starts_at: starts_at.iso8601,
              movie_id: movie.id,
              room_id: room.id
            }
          }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:created)
        end
      end

      it "creates session in the distant future" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          starts_at = 1.year.from_now
          params = {
            session: {
              starts_at: starts_at.iso8601,
              movie_id: movie.id,
              room_id: room.id
            }
          }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:created)
        end
      end

      it "allows multiple sessions in different rooms at the same time" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          room1 = create(:room, number: 1)
          room2 = create(:room, number: 2)
          starts_at = 2.hours.from_now

          create(:session, movie: movie, room: room1, starts_at: starts_at)

          params = {
            session: {
              starts_at: starts_at.iso8601,
              movie_id: movie.id,
              room_id: room2.id
            }
          }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:created)
        end
      end

      it "allows non-overlapping sessions in the same room" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          # First session: 14:00 - 16:00
          create(:session, movie: movie, room: room, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Second session: 16:00 - 18:00 (starts exactly when first ends)
          params = {
            session: {
              starts_at: Time.zone.local(2026, 7, 25, 16, 0, 0).iso8601,
              movie_id: movie.id,
              room_id: room.id
            }
          }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:created)
        end
      end
    end

    context "with invalid parameters" do
      it "does not create a new Session" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          invalid_attributes = {
            session: {
              starts_at: 1.hour.ago.iso8601,  # in the past
              movie_id: movie.id,
              room_id: room.id
            }
          }
          expect {
            post sessions_url, params: invalid_attributes, as: :json
          }.to change(Session, :count).by(0)
        end
      end

      it "renders a JSON response with errors" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          invalid_attributes = {
            session: {
              starts_at: 1.hour.ago.iso8601,  # in the past
              movie_id: movie.id,
              room_id: room.id
            }
          }
          post sessions_url, params: invalid_attributes, as: :json
          expect(response).to have_http_status(:unprocessable_content)
          expect(response.content_type).to match(a_string_including("application/json"))

          json = response.parsed_body
          expect(json["starts_at"]).to include("cannot be in the past")
        end
      end

      it "returns error when starts_at is missing" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          params = { session: { movie_id: movie.id, room_id: room.id } }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["starts_at"]).to include("can't be blank")
        end
      end

      it "returns error when movie_id is missing" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          params = { session: { starts_at: 2.hours.from_now.iso8601, room_id: room.id } }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["movie"]).to include("must exist")
        end
      end

      it "returns error when room_id is missing" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          params = { session: { starts_at: 2.hours.from_now.iso8601, movie_id: movie.id } }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["room"]).to include("must exist")
        end
      end

      it "returns error when starts_at is in the past" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          params = {
            session: {
              starts_at: 1.hour.ago.iso8601,
              movie_id: movie.id,
              room_id: room.id
            }
          }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["starts_at"]).to include("cannot be in the past")
        end
      end

      it "returns error when starts_at is less than 30 minutes from now" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          params = {
            session: {
              starts_at: 29.minutes.from_now.iso8601,
              movie_id: movie.id,
              room_id: room.id
            }
          }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["starts_at"]).to include("must be at least 30 minutes from now")
        end
      end
    end

    context "with overlapping sessions" do
      it "returns error when session overlaps with existing session in same room" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          # Create first session: 14:00 - 16:00
          create(:session, movie: movie, room: room, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))

          # Try to create overlapping session: 15:00 - 17:00
          params = {
            session: {
              starts_at: Time.zone.local(2026, 7, 25, 15, 0, 0).iso8601,
              movie_id: movie.id,
              room_id: room.id
            }
          }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["base"]).to include("There is already a session in this room at that time")
        end
      end

      it "returns error when session has exact same time as existing session" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          starts_at = Time.zone.local(2026, 7, 25, 14, 0, 0)
          create(:session, movie: movie, room: room, starts_at: starts_at)

          params = {
            session: {
              starts_at: starts_at.iso8601,
              movie_id: movie.id,
              room_id: room.id
            }
          }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["base"]).to include("There is already a session in this room at that time")
        end
      end

      it "returns error when new session would completely contain existing session" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie_short = create(:movie, duration: 60)
          movie_long = create(:movie, duration: 300)

          # Create short session: 15:00 - 16:00
          create(:session, movie: movie_short, room: room, starts_at: Time.zone.local(2026, 7, 25, 15, 0, 0))

          # Try to create long session that contains it: 14:00 - 19:00
          params = {
            session: {
              starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0).iso8601,
              movie_id: movie_long.id,
              room_id: room.id
            }
          }
          post sessions_url, params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["base"]).to include("There is already a session in this room at that time")
        end
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      it "updates the requested session" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session = create(:session, movie: movie, room: room, starts_at: 2.hours.from_now)
          new_starts_at = 5.hours.from_now

          params = { session: { starts_at: new_starts_at.iso8601 } }
          patch session_url(session), params: params, as: :json
          session.reload

          expect(Time.zone.parse(session.starts_at.to_s)).to be_within(1.second).of(new_starts_at)
        end
      end

      it "renders a JSON response with the session" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session = create(:session, movie: movie, room: room, starts_at: 2.hours.from_now)
          new_starts_at = 5.hours.from_now

          params = { session: { starts_at: new_starts_at.iso8601 } }
          patch session_url(session), params: params, as: :json

          expect(response).to have_http_status(:ok)
          expect(response.content_type).to match(a_string_including("application/json"))
        end
      end

      it "allows changing the room" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          room2 = create(:room, number: 2)
          session = create(:session, movie: movie, room: room, starts_at: 2.hours.from_now)

          params = { session: { room_id: room2.id } }
          patch session_url(session), params: params, as: :json

          expect(response).to have_http_status(:ok)
          session.reload
          expect(session.room_id).to eq(room2.id)
        end
      end

      it "allows changing the movie and recalculates ends_at" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie2 = create(:movie, duration: 180)
          starts_at = 2.hours.from_now
          session = create(:session, movie: movie, room: room, starts_at: starts_at)

          original_ends_at = session.ends_at
          params = { session: { movie_id: movie2.id } }
          patch session_url(session), params: params, as: :json

          expect(response).to have_http_status(:ok)
          session.reload
          expect(session.ends_at).not_to eq(original_ends_at)
          expect(session.ends_at).to be_within(1.second).of(starts_at + 180.minutes)
        end
      end

      it "allows updating to non-overlapping time" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session1 = create(:session, movie: movie, room: room, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))
          create(:session, movie: movie, room: room, starts_at: Time.zone.local(2026, 7, 25, 17, 0, 0))

          # Update session1 to 20:00 (no overlap)
          params = { session: { starts_at: Time.zone.local(2026, 7, 25, 20, 0, 0).iso8601 } }
          patch session_url(session1), params: params, as: :json

          expect(response).to have_http_status(:ok)
        end
      end
    end

    context "with invalid parameters" do
      it "renders a JSON response with errors" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session = create(:session, movie: movie, room: room, starts_at: 2.hours.from_now)

          params = { session: { starts_at: 1.hour.ago.iso8601 } }
          patch session_url(session), params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          expect(response.content_type).to match(a_string_including("application/json"))

          json = response.parsed_body
          expect(json["starts_at"]).to include("cannot be in the past")
        end
      end

      it "does not update when starts_at is in the past" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          original_starts_at = 2.hours.from_now
          session = create(:session, movie: movie, room: room, starts_at: original_starts_at)

          params = { session: { starts_at: 1.hour.ago.iso8601 } }
          patch session_url(session), params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          session.reload
          expect(session.starts_at).to be_within(1.second).of(original_starts_at)
        end
      end

      it "does not update when starts_at is less than 30 minutes from now" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          original_starts_at = 2.hours.from_now
          session = create(:session, movie: movie, room: room, starts_at: original_starts_at)

          params = { session: { starts_at: 15.minutes.from_now.iso8601 } }
          patch session_url(session), params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          session.reload
          expect(session.starts_at).to be_within(1.second).of(original_starts_at)
        end
      end

      it "returns error when updating to overlapping time" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          session1 = create(:session, movie: movie, room: room, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))
          create(:session, movie: movie, room: room, starts_at: Time.zone.local(2026, 7, 25, 17, 0, 0))

          # Try to update session1 to 18:00 (overlaps with session at 17:00)
          params = { session: { starts_at: Time.zone.local(2026, 7, 25, 18, 0, 0).iso8601 } }
          patch session_url(session1), params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["base"]).to include("There is already a session in this room at that time")
        end
      end

      it "returns error when changing movie causes overlap" do
        travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
          movie_short = create(:movie, duration: 90)
          movie_long = create(:movie, duration: 240)

          # Session 1: 14:00 - 15:30 (90 min)
          session1 = create(:session, movie: movie_short, room: room, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))
          # Session 2: 17:00 - 19:00
          create(:session, movie: movie, room: room, starts_at: Time.zone.local(2026, 7, 25, 17, 0, 0))

          # Try to change session1 to long movie (14:00 - 18:00), causing overlap
          params = { session: { movie_id: movie_long.id } }
          patch session_url(session1), params: params, as: :json

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["base"]).to include("There is already a session in this room at that time")
        end
      end
    end

    it "returns 404 when session does not exist" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        valid_attributes = {
          session: {
            starts_at: 2.hours.from_now.iso8601,
            movie_id: movie.id,
            room_id: room.id
          }
        }
        patch session_url(id: "non-existent-uuid"), params: valid_attributes, as: :json
        expect(response).to have_http_status(:not_found)
        json = response.parsed_body
        expect(json["error"]).to be_present
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested session" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        session = create(:session, movie: movie, room: room, starts_at: 2.hours.from_now)
        expect {
          delete session_url(session), as: :json
        }.to change(Session, :count).by(-1)
      end
    end

    it "returns no content status" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        session = create(:session, movie: movie, room: room, starts_at: 2.hours.from_now)
        delete session_url(session), as: :json
        expect(response).to have_http_status(:no_content)
      end
    end

    it "returns 404 when session does not exist" do
      delete session_url(id: "non-existent-uuid"), as: :json
      expect(response).to have_http_status(:not_found)
      json = response.parsed_body
      expect(json["error"]).to be_present
    end

    it "allows creating a new session in the same time slot after deletion" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        starts_at = Time.zone.local(2026, 7, 25, 14, 0, 0)
        session = create(:session, movie: movie, room: room, starts_at: starts_at)

        delete session_url(session), as: :json
        expect(response).to have_http_status(:no_content)

        # Now create a new session at the same time
        params = {
          session: {
            starts_at: starts_at.iso8601,
            movie_id: movie.id,
            room_id: room.id
          }
        }
        post sessions_url, params: params, as: :json
        expect(response).to have_http_status(:created)
      end
    end
  end

  describe "edge cases" do
    it "correctly handles multiple non-overlapping sessions in same room" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        # Session 1: 14:00 - 16:00
        create(:session, movie: movie, room: room, starts_at: Time.zone.local(2026, 7, 25, 14, 0, 0))
        # Session 2: 16:00 - 18:00
        create(:session, movie: movie, room: room, starts_at: Time.zone.local(2026, 7, 25, 16, 0, 0))

        # Session 3: 18:00 - 20:00
        params = {
          session: {
            starts_at: Time.zone.local(2026, 7, 25, 18, 0, 0).iso8601,
            movie_id: movie.id,
            room_id: room.id
          }
        }
        post sessions_url, params: params, as: :json
        expect(response).to have_http_status(:created)
      end
    end

    it "handles sessions with very short movies" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        short_movie = create(:movie, duration: 1)
        starts_at = 2.hours.from_now

        params = {
          session: {
            starts_at: starts_at.iso8601,
            movie_id: short_movie.id,
            room_id: room.id
          }
        }
        post sessions_url, params: params, as: :json

        expect(response).to have_http_status(:created)
        json = response.parsed_body
        expect(Time.zone.parse(json["ends_at"])).to be_within(1.second).of(starts_at + 1.minute)
      end
    end

    it "handles sessions with very long movies" do
      travel_to Time.zone.local(2026, 7, 25, 10, 0, 0) do
        long_movie = create(:movie, duration: 300)
        starts_at = 2.hours.from_now

        params = {
          session: {
            starts_at: starts_at.iso8601,
            movie_id: long_movie.id,
            room_id: room.id
          }
        }
        post sessions_url, params: params, as: :json

        expect(response).to have_http_status(:created)
        json = response.parsed_body
        expect(Time.zone.parse(json["ends_at"])).to be_within(1.second).of(starts_at + 300.minutes)
      end
    end
  end
end
