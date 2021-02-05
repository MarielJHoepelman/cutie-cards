class User < ApplicationRecord
  has_many :scores
  validates :name, presence: true

  def best_score
    scores.minimum("score")
  end

end
