require "rails_helper"

RSpec.describe "/rooms", type: :request do
  let(:valid_attributes) do
    { room: { number: 5 } }
  end

  let(:invalid_attributes) do
    { room: { number: -1 } }
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:room, number: 1)
      create(:room, number: 2)
      get rooms_url, as: :json
      expect(response).to be_successful
      expect(response.content_type).to match(a_string_including("application/json"))
    end

    it "returns all rooms" do
      room1 = create(:room, number: 1)
      room2 = create(:room, number: 2)
      get rooms_url, as: :json

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json.length).to eq(2)
      expect(json.map { |r| r["number"] }).to contain_exactly(1, 2)
    end

    it "returns empty array when no rooms exist" do
      get rooms_url, as: :json
      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq([])
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      room = create(:room)
      get room_url(room), as: :json
      expect(response).to be_successful
      expect(response.content_type).to match(a_string_including("application/json"))
    end

    it "returns the room with all attributes" do
      room = create(:room, number: 10)
      get room_url(room), as: :json

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json["id"]).to eq(room.id)
      expect(json["number"]).to eq(10)
    end

    it "returns 404 when room does not exist" do
      get room_url(id: "non-existent-uuid"), as: :json
      expect(response).to have_http_status(:not_found)
      json = response.parsed_body
      expect(json["error"]).to be_present
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Room" do
        expect {
          post rooms_url, params: valid_attributes, as: :json
        }.to change(Room, :count).by(1)
      end

      it "renders a JSON response with the new room" do
        post rooms_url, params: valid_attributes, as: :json
        expect(response).to have_http_status(:created)
        expect(response.content_type).to match(a_string_including("application/json"))

        json = response.parsed_body
        expect(json["number"]).to eq(5)
      end

      it "creates room with number 1" do
        post rooms_url, params: { room: { number: 1 } }, as: :json

        expect(response).to have_http_status(:created)
        json = response.parsed_body
        expect(json["number"]).to eq(1)
      end

      it "creates room with large number" do
        post rooms_url, params: { room: { number: 999 } }, as: :json

        expect(response).to have_http_status(:created)
        json = response.parsed_body
        expect(json["number"]).to eq(999)
      end
    end

    context "with invalid parameters" do
      it "does not create a new Room" do
        expect {
          post rooms_url, params: invalid_attributes, as: :json
        }.to change(Room, :count).by(0)
      end

      it "renders a JSON response with errors for the new room" do
        post rooms_url, params: invalid_attributes, as: :json
        expect(response).to have_http_status(:unprocessable_content)
        expect(response.content_type).to match(a_string_including("application/json"))

        json = response.parsed_body
        expect(json["number"]).to include("must be greater than 0")
      end

      it "returns 400 bad request when number is missing (params.expect fails)" do
        post rooms_url, params: { room: {} }, as: :json

        expect(response).to have_http_status(:bad_request)
        json = response.parsed_body
        expect(json["error"]).to be_present
      end

      it "returns error when number is zero" do
        post rooms_url, params: { room: { number: 0 } }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        json = response.parsed_body
        expect(json["number"]).to include("must be greater than 0")
      end

      it "returns error when number is negative" do
        post rooms_url, params: { room: { number: -10 } }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        json = response.parsed_body
        expect(json["number"]).to include("must be greater than 0")
      end

      it "returns error when number is not an integer" do
        post rooms_url, params: { room: { number: 5.5 } }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        json = response.parsed_body
        expect(json["number"]).to include("must be an integer")
      end

      it "returns error when number is already taken" do
        create(:room, number: 10)
        post rooms_url, params: { room: { number: 10 } }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        json = response.parsed_body
        expect(json["number"]).to include("has already been taken")
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) do
        { room: { number: 15 } }
      end

      it "updates the requested room" do
        room = create(:room, number: 5)
        patch room_url(room), params: new_attributes, as: :json
        room.reload

        expect(room.number).to eq(15)
      end

      it "renders a JSON response with the room" do
        room = create(:room, number: 5)
        patch room_url(room), params: new_attributes, as: :json

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including("application/json"))

        json = response.parsed_body
        expect(json["number"]).to eq(15)
      end

      it "allows updating to number 1" do
        room = create(:room, number: 10)
        patch room_url(room), params: { room: { number: 1 } }, as: :json

        expect(response).to have_http_status(:ok)
        room.reload
        expect(room.number).to eq(1)
      end
    end

    context "with invalid parameters" do
      it "renders a JSON response with errors for the room" do
        room = create(:room, number: 5)
        patch room_url(room), params: invalid_attributes, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.content_type).to match(a_string_including("application/json"))

        json = response.parsed_body
        expect(json["number"]).to include("must be greater than 0")
      end

      it "does not update room when number is zero" do
        room = create(:room, number: 5)
        patch room_url(room), params: { room: { number: 0 } }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        room.reload
        expect(room.number).to eq(5)
      end

      it "does not update room when number is negative" do
        room = create(:room, number: 5)
        patch room_url(room), params: { room: { number: -10 } }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        room.reload
        expect(room.number).to eq(5)
      end

      it "does not update room when number is already taken by another room" do
        create(:room, number: 20)
        room = create(:room, number: 10)
        patch room_url(room), params: { room: { number: 20 } }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        json = response.parsed_body
        expect(json["number"]).to include("has already been taken")
      end

      it "does not update room when number is decimal" do
        room = create(:room, number: 5)
        patch room_url(room), params: { room: { number: 7.5 } }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        room.reload
        expect(room.number).to eq(5)
      end
    end

    it "returns 404 when room does not exist" do
      patch room_url(id: "non-existent-uuid"), params: valid_attributes, as: :json
      expect(response).to have_http_status(:not_found)
      json = response.parsed_body
      expect(json["error"]).to be_present
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested room" do
      room = create(:room)
      expect {
        delete room_url(room), as: :json
      }.to change(Room, :count).by(-1)
    end

    it "returns no content status" do
      room = create(:room)
      delete room_url(room), as: :json
      expect(response).to have_http_status(:no_content)
    end

    it "destroys associated sessions when room is destroyed" do
      room = create(:room)
      movie = create(:movie)
      create(:session, movie: movie, room: room)

      expect {
        delete room_url(room), as: :json
      }.to change(Session, :count).by(-1)
    end

    it "returns 404 when room does not exist" do
      delete room_url(id: "non-existent-uuid"), as: :json
      expect(response).to have_http_status(:not_found)
      json = response.parsed_body
      expect(json["error"]).to be_present
    end
  end

  describe "edge cases" do
    it "allows creating multiple rooms with different numbers" do
      post rooms_url, params: { room: { number: 1 } }, as: :json
      expect(response).to have_http_status(:created)

      post rooms_url, params: { room: { number: 2 } }, as: :json
      expect(response).to have_http_status(:created)

      post rooms_url, params: { room: { number: 3 } }, as: :json
      expect(response).to have_http_status(:created)

      expect(Room.count).to eq(3)
    end

    it "does not allow updating a room to have the same number as itself (no-op update)" do
      room = create(:room, number: 10)
      patch room_url(room), params: { room: { number: 10 } }, as: :json

      expect(response).to have_http_status(:ok)
      room.reload
      expect(room.number).to eq(10)
    end
  end
end
