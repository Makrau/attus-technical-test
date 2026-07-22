class NoOverlappingSessionValidator < ActiveModel::Validator
  def validate(session)
    return if session.starts_at.blank? || session.ends_at.blank? || session.room_id.blank?

    overlapping = Session
      .where(room_id: session.room_id)
      .where.not(id: session.id)
      .where("starts_at < :ends_at AND ends_at > :starts_at",
             starts_at: session.starts_at, ends_at: session.ends_at)

    if overlapping.exists?
      session.errors.add(:starts_at, "conflicts with an existing session in this room")
      session.errors.add(:room_id, "already has a session scheduled at this time")
    end
  end
end
