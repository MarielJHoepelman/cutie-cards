class ApplicationController < ActionController::Base

  def record_score
    Score.all.minimum(:score)
  end
end
