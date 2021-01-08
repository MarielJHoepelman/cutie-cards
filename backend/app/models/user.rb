class User < ApplicationRecord
  has_many :scores
  validates :name, presence: true

  def best_score
    return self.scores.minimum("score")
  end
end
