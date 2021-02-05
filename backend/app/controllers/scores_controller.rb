class ScoresController < ApplicationController
skip_before_action :verify_authenticity_token

  def create
    data = Score.find_or_create_by(score_params)
    if data.valid?
      render json: {user_id: data.user_id, score: data.score}
    else
      render json: data.errors.messages.to_json, status: 500
    end
  end

  def index
    render json: Score.best_scores
  end

  def score_params
    params.require(:data).permit(:user_id, :score)
  end
end
