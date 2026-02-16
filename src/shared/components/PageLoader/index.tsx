// import logoLarge from 'shared/assets/logo.svg'
import './pageLoader.scss'

export const PageLoader = () => {
  // const { _logo } = props

  return (
    <div className='page-loader'>
      <div className='page-loader__logo'>
        <h1>Loading...</h1>
        {/* {logo || <img src={logoLarge} alt='' />} */}
      </div>
    </div>
  )
}
