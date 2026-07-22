class CreateSessions < ActiveRecord::Migration[8.1]
  def change
    create_table :sessions, id: :uuid do |t|
      t.datetime :starts_at
      t.datetime :ends_at
      t.references :room, null: false, foreign_key: true, type: :uuid
      t.references :movie, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
