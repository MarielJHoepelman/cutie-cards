class DropCards < ActiveRecord::Migration[6.0]
  def down
   drop_table :cards
  end
end
