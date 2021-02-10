class User < ApplicationRecord
  has_many :scores
  validates :name, presence: true, format: { with: /\A[a-zA-Z0-9]+\z/, message: "Oops! invalid format. Please enter a username between 3 and 8 characters long with no characters."}

  def best_score
    scores.minimum("score")
  end

end
