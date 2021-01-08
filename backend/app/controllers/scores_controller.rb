class ScoresController < ApplicationController
skip_before_action :verify_authenticity_token

  def create
    data = Score.create(score_params)
    render json: {user_id: data.user_id, score: data.score}
  end

  def score_params
    params.require(:data).permit(:user_id, :score)
  end
end
