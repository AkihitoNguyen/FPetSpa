// eslint-disable-next-line no-unused-vars
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Product/Product.css';
import ProductList from '../../components/PageProduct/ProductList';

const Product = () => {
  return (
    <div className='breakdance'>
      <section className="bde-section-163033-100 bde-section">
        <div className="section-container">
          <div className="bde-columns-163033-102 bde-columns">
            <div className="bde-column-163033-103 bde-column">
              <h6 className="bde-heading-163033-105 bde-heading">
                Sample Boxes for Dogs
              </h6>
              <h1 className="bde-heading-163033-106 bde-heading">
                Take the Taste Test
              </h1>
              <div className="bde-rich-text-163033-107 bde-rich-text breakdance-rich-text-styles">
                <p>These boxes are the perfect introduction into learning what BIXBI is all about and finding the perfect recipe for your dog.</p>
              </div>
            </div>
            <div className="bde-column-163033-104 bde-column" data-selected="true" data-label-id="0" data-metatip="true">
              <div className="bde-image-163033-108 bde-image">
                <figure className="breakdance-image breakdance-image--163049">
                  <div className="breakdance-image-container">
                    <div className="breakdance-image-clip">
                      <img
                        className="breakdance-image-object"
                        src="https://bixbipet.com/wp-content/uploads/2024/01/SampleBox_2023_SideView_Closed_web2.png"
                        width="1500"
                        height="1135"
                        srcSet="https://bixbipet.com/wp-content/uploads/2024/01/SampleBox_2023_SideView_Closed_web2.png 1500w, https://bixbipet.com/wp-content/uploads/2024/01/SampleBox_2023_SideView_Closed_web2-300x227.png 300w, https://bixbipet.com/wp-content/uploads/2024/01/SampleBox_2023_SideView_Closed_web2-1024x775.png 1024w, https://bixbipet.com/wp-content/uploads/2024/01/SampleBox_2023_SideView_Closed_web2-768x581.png 768w, https://bixbipet.com/wp-content/uploads/2024/01/SampleBox_2023_SideView_Closed_web2-600x454.png 600w"
                      />
                    </div>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>
      <>
      <ProductList/>
      </>
    </div>
  );
};

export default Product;
CSS