import PropTypes from 'prop-types'
import { memo } from 'react'

const Flag = memo(({ country, className, style }) => {
  if (!country) return null

  const flag = require(`../assets/flags/${country}.svg`)

  console.log('🚀 ~ file: Flag.js:9 ~ Flag ~ flag:', flag)
  return <img src={flag} alt={country} className={className} style={style} />
})

Flag.propTypes = {
  country: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
}

export default Flag
