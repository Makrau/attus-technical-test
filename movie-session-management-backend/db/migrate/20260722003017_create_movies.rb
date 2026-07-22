class CreateMovies < ActiveRecord::Migration[8.1]
  def change
    create_table :movies, id: :uuid do |t|
      t.string :title, null: false
      t.integer :duration, null: false
      t.string :director, null: false
      t.string :synopsis

      t.timestamps
    end
  end
end
