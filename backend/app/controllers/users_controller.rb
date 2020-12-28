class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    user = User.find_or_create_by(user_params)
    if user.valid?
      render json: {name: user.name, id: user.id}
    else
      render json: user.errors.messages.to_json, status: 500
    end
  end

  private
  def user_params
    params.require(:user).permit(:name)
  end
end
