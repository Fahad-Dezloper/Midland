import * as React from 'react';

type SvgProps = React.SVGProps<SVGSVGElement>;

const ShoppingCartIcon = React.forwardRef<SVGSVGElement, SvgProps>(function ShoppingCartIcon(
  props,
  ref
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="14 14.6589994430542 36.17958068847656 34.02299880981445"
      width={24}
      height={24}
      className="shopping-cart-icon"
      ref={ref}
      {...props}
    >
      {/* Handle and wheels */}
      <g className='animation-1'>
      <g>
        <path
          className="cart-handle"
          fill="none"
          stroke="#000000"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          d="M21.09,24.548l-1.34-6.315c-0.397-1.815-1.978-3.074-3.858-3.074H14.5"
        />
      </g>


      {/* Box inside */}
      <g>
        <path
          className="cart-box"
          fill="#FFFFFF"
          stroke="#0493D7"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          d="M40.346,16.25h-9.691c-1.19,0-2.154,0.965-2.154,2.154V21.5h14v-3.096C42.5,17.215,41.535,16.25,40.346,16.25z"
        />
      </g>


      {/* Cart body */}
      <g>
        <path
          className="cart-body"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          d="M41.507,39H29.131c-2.891,0-5.38-1.92-5.947-4.587l-2.18-10.254c-0.292-1.376,0.826-2.659,2.317-2.659h23.995   c1.491,0,2.609,1.283,2.317,2.659l-2.18,10.254C46.887,37.08,44.398,39,41.507,39z"
        />
      </g>
      {/* Stripes */}
      <g>
        <line
          className="cart-stripe"
          fill="none"
          stroke="#0493D7"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          x1="40.569"
          y1="33.127"
          x2="40.569"
          y2="28.068"
        />
        <line
          className="cart-stripe"
          fill="none"
          stroke="#0493D7"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          x1="30.069"
          y1="33.127"
          x2="30.069"
          y2="28.068"
        />
      </g>
      </g>

      
{/* circlce */}
<g className=''>
        <circle
          className="cart-wheel left"
          fill="#E6E9EC"
          stroke="#000000"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          cx="28.319"
          cy="46"
          r="2.182"
        />
        <circle
          className="cart-wheel right"
          fill="#E6E9EC"
          stroke="#000000"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          cx="42.319"
          cy="46"
          r="2.182"
        />
        </g>


    </svg>
  );
});

export default ShoppingCartIcon;


