require "rails_helper"

RSpec.describe "/movies", type: :request do
  let(:valid_attributes) do
    {
      title: "Inception",
      director: "Christopher Nolan",
      duration: 148,
      synopsis: "A thief who steals corporate secrets through dream-sharing technology."
    }
  end

  let(:invalid_attributes) do
    {
      title: "",
      director: "",
      duration: -10
    }
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:movie)
      create(:movie)
      get movies_url, as: :json
      expect(response).to be_successful
      expect(response.content_type).to match(a_string_including("application/json"))
    end

    it "returns all movies" do
      movie1 = create(:movie, title: "Movie 1")
      movie2 = create(:movie, title: "Movie 2")
      get movies_url, as: :json

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json.length).to eq(2)
      expect(json.map { |m| m["title"] }).to contain_exactly("Movie 1", "Movie 2")
    end

    it "returns empty array when no movies exist" do
      get movies_url, as: :json
      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq([])
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      movie = create(:movie)
      get movie_url(movie), as: :json
      expect(response).to be_successful
      expect(response.content_type).to match(a_string_including("application/json"))
    end

    it "returns the movie with all attributes" do
      movie = create(:movie, title: "Test Movie", director: "Test Director", duration: 120, synopsis: "Test synopsis")
      get movie_url(movie), as: :json

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json["id"]).to eq(movie.id)
      expect(json["title"]).to eq("Test Movie")
      expect(json["director"]).to eq("Test Director")
      expect(json["duration"]).to eq(120)
      expect(json["synopsis"]).to eq("Test synopsis")
    end

    it "returns 404 when movie does not exist" do
      get movie_url(id: "non-existent-uuid"), as: :json
      expect(response).to have_http_status(:not_found)
      json = response.parsed_body
      expect(json["error"]).to be_present
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Movie" do
        expect {
          post movies_url, params: valid_attributes, as: :json
        }.to change(Movie, :count).by(1)
      end

      it "renders a JSON response with the new movie" do
        post movies_url, params: valid_attributes, as: :json
        expect(response).to have_http_status(:created)
        expect(response.content_type).to match(a_string_including("application/json"))

        json = response.parsed_body
        expect(json["title"]).to eq("Inception")
        expect(json["director"]).to eq("Christopher Nolan")
        expect(json["duration"]).to eq(148)
      end

      it "creates a movie without synopsis (optional field)" do
        params = valid_attributes.except(:synopsis)
        post movies_url, params: params, as: :json

        expect(response).to have_http_status(:created)
        json = response.parsed_body
        expect(json["synopsis"]).to be_nil
      end
    end

    context "with invalid parameters" do
      it "does not create a new Movie" do
        expect {
          post movies_url, params: invalid_attributes, as: :json
        }.to change(Movie, :count).by(0)
      end

      it "renders a JSON response with errors for the new movie" do
        post movies_url, params: invalid_attributes, as: :json
        expect(response).to have_http_status(:unprocessable_content)
        expect(response.content_type).to match(a_string_including("application/json"))

        json = response.parsed_body
        expect(json["title"]).to include("can't be blank")
        expect(json["director"]).to include("can't be blank")
        expect(json["duration"]).to include("must be greater than 0")
      end

      it "returns error when title is missing" do
        params = valid_attributes.except(:title)
        post movies_url, params: params, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        json = response.parsed_body
        expect(json["title"]).to include("can't be blank")
      end

      it "returns error when director is missing" do
        params = valid_attributes.except(:director)
        post movies_url, params: params, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        json = response.parsed_body
        expect(json["director"]).to include("can't be blank")
      end

      it "returns error when duration is zero" do
        params = valid_attributes.merge(duration: 0)
        post movies_url, params: params, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        json = response.parsed_body
        expect(json["duration"]).to include("must be greater than 0")
      end

      it "returns error when duration is negative" do
        params = valid_attributes.merge(duration: -100)
        post movies_url, params: params, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        json = response.parsed_body
        expect(json["duration"]).to include("must be greater than 0")
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) do
        {
          title: "Updated Title",
          director: "Updated Director",
          duration: 200
        }
      end

      it "updates the requested movie" do
        movie = create(:movie)
        patch movie_url(movie), params: new_attributes, as: :json
        movie.reload

        expect(movie.title).to eq("Updated Title")
        expect(movie.director).to eq("Updated Director")
        expect(movie.duration).to eq(200)
      end

      it "renders a JSON response with the movie" do
        movie = create(:movie)
        patch movie_url(movie), params: new_attributes, as: :json

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including("application/json"))

        json = response.parsed_body
        expect(json["title"]).to eq("Updated Title")
      end

      it "allows updating only some attributes" do
        movie = create(:movie, title: "Original Title", director: "Original Director")
        patch movie_url(movie), params: { title: "New Title Only" }, as: :json

        expect(response).to have_http_status(:ok)
        movie.reload
        expect(movie.title).to eq("New Title Only")
        expect(movie.director).to eq("Original Director")
      end

      it "allows removing synopsis by setting it to nil" do
        movie = create(:movie, synopsis: "Original synopsis")
        patch movie_url(movie), params: { synopsis: nil }, as: :json

        expect(response).to have_http_status(:ok)
        movie.reload
        expect(movie.synopsis).to be_nil
      end
    end

    context "with invalid parameters" do
      it "renders a JSON response with errors for the movie" do
        movie = create(:movie)
        patch movie_url(movie), params: invalid_attributes, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.content_type).to match(a_string_including("application/json"))

        json = response.parsed_body
        expect(json["title"]).to include("can't be blank")
      end

      it "does not update movie when title is blank" do
        movie = create(:movie, title: "Original Title")
        patch movie_url(movie), params: { title: "" }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        movie.reload
        expect(movie.title).to eq("Original Title")
      end

      it "does not update movie when duration is invalid" do
        movie = create(:movie, duration: 120)
        patch movie_url(movie), params: { duration: -50 }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        movie.reload
        expect(movie.duration).to eq(120)
      end
    end

    it "returns 404 when movie does not exist" do
      patch movie_url(id: "non-existent-uuid"), params: valid_attributes, as: :json
      expect(response).to have_http_status(:not_found)
      json = response.parsed_body
      expect(json["error"]).to be_present
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested movie" do
      movie = create(:movie)
      expect {
        delete movie_url(movie), as: :json
      }.to change(Movie, :count).by(-1)
    end

    it "returns no content status" do
      movie = create(:movie)
      delete movie_url(movie), as: :json
      expect(response).to have_http_status(:no_content)
    end

    it "destroys associated sessions when movie is destroyed" do
      movie = create(:movie)
      room = create(:room)
      create(:session, movie: movie, room: room)

      expect {
        delete movie_url(movie), as: :json
      }.to change(Session, :count).by(-1)
    end

    it "returns 404 when movie does not exist" do
      delete movie_url(id: "non-existent-uuid"), as: :json
      expect(response).to have_http_status(:not_found)
      json = response.parsed_body
      expect(json["error"]).to be_present
    end
  end
end
