class CreateRooms < ActiveRecord::Migration[8.1]
  def change
    create_table :rooms, id: :uuid do |t|
      t.integer :number, null: false

      t.timestamps
    end

    add_index :rooms, :number, unique: true
  end
end
