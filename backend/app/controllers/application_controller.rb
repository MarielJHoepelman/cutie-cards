class ApplicationController < ActionController::Base

  helper_method :record_score

  def record_score
    Score.all.minimum(:score)
  end
end
