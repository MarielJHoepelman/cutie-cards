class Score < ApplicationRecord
  belongs_to :user

  def self.best_scores
    scores = Score.all.map do |score|
      {
        name: score.user.name,
        score: score.user.best_score
      }
    end

    scores.sort_by { |element| element[:score] }.uniq
  end
end
