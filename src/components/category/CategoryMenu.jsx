import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../features/products/productThunks';

const CategoryMenu = () => {
  const dispatch = useDispatch();
  const { categories, categoriesLoading } = useSelector((state) => state.products);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  if (categoriesLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto py-4 px-4 bg-white shadow-sm scrollbar-hide">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 h-10 w-24 rounded-full flex-shrink-0"></div>
        ))}
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center space-x-8 overflow-x-auto py-3">
          {categories.map((category) => (
            <li key={category._id} className="flex-shrink-0 relative group">
              <Link 
                to={`/products?categorySlug=${category.slug}`}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                {category.name}
              </Link>
              
              {/* Optional dropdown for subcategories if backend provided them embedded */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {category.subcategories.map(sub => (
                      <Link 
                        key={sub._id}
                        to={`/products?categorySlug=${category.slug}&subCategory=${sub._id}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoryMenu;
