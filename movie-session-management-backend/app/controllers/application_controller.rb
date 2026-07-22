class ApplicationController < ActionController::API
  rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing
  rescue_from ActionDispatch::Http::Parameters::ParseError, with: :handle_bad_request
  rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found

  private

  def handle_parameter_missing(exception)
    render json: { error: exception.message }, status: :bad_request
  end

  def handle_bad_request(exception)
    render json: { error: "#{exception.message }. Check the payload for inconsistent or missing data."}, status: :bad_request
  end

  def handle_record_not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end
end
