class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    render json: [{name: 'Mariel'}]
  end

  def create
    puts params
    render json: { id: 'whatever we need to do'}
  end

end
