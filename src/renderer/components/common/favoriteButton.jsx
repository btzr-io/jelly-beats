import React from 'react'
import Button from '@/components/button'
import { HEART as iconHeart, HEART_OUTLINE as iconHeartEmpty } from '@/constants/icons'

const FavoriteButton = ({ isFavorite, onClick }) => (
  <Button
    size="large"
    type="table-action"
    iconColor={isFavorite ? 'var(--color-red)' : ''}
    icon={isFavorite ? iconHeart : iconHeartEmpty}
    toggle={isFavorite}
    onClick={onClick}
  />
)

export default FavoriteButton
