import { useEffect, useState } from "react";
import { useFilter } from "./FilterContext";
import { Tally3 } from "lucide-react";
import axios from "axios";
import BookCard from "./BookCard";

const MainContent = () => {
  const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } = useFilter();
  const [product, setProduct] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    let url = `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}`;

    if (keyword) {
      url = `https://dummyjson.com/products/search?q=${keyword}`;
    }

    axios
      .get(url)
      .then((response) => {
        setProduct(response.data.products);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [currentPage, keyword]);

  const getFilterProduct = () => {
    let filteredProducts = [...product];

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (item) => item.category === selectedCategory
      );
    }

    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((item) => item.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((item) => item.price <= maxPrice);
    }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case "expensive":
        return filteredProducts.sort((a, b) => b.price - a.price);
      case "cheap":
        return filteredProducts.sort((a, b) => a.price - b.price);
      case "popular":
        return filteredProducts.sort((a, b) => b.rating - a.rating);
      default:
        return filteredProducts;
    }
  };

  const filteredProducts = getFilterProduct();

  const totalProducts = 100;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page: number) => {
    if(page > 0 && page < totalPages){
        setCurrentPage(page);
    };

  }

  const getPaginationButton = () =>{
    const buttons: number[] = []
    let starPage = Math.max(1, currentPage -2)
    let endPage = Math.min(totalPages,currentPage + 2)

    if (currentPage -2  < 1) {
        endPage = Math.min(totalPages,endPage + (2 - currentPage - 1));
    }

    
    if (currentPage + 2  > totalPages) {
        starPage = Math.min(1, starPage - (2 - totalPages - currentPage));
    }

    for (let page = starPage; page < endPage; page++) {
        buttons.push(page)
    }

    return buttons;
  }

  return (
    <section className="xl:w-220 lg:w-220 sm:w-160 xs:w-[20rem] p-5">
      <div className="md-5">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="relative md-5 mt-5">
            <button
              type="button"
              onClick={() => setDropDownOpen((open) => !open)}
              className="px-4 py-2 rounded-full flex items-center"
            >
              <Tally3 className="mr-2" />
              {filter === "all" ? "Filter" : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>

            {dropdownOpen && (
              <div className="absolute bg-white border border-gray-300 rounded mt-2 w-full sm:w-40">
                <button
                  type="button"
                  onClick={() => {
                    setFilter("cheap");
                    setDropDownOpen(false);
                  }}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                >
                  Cheap
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilter("expensive");
                    setDropDownOpen(false);
                  }}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                >
                  Expensive
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilter("popular");
                    setDropDownOpen(false);
                  }}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                >
                  Popular
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setDropDownOpen(false);
                  }}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                >
                  All
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <BookCard key={product.id} id={product.id} title={product.title} image={product.thumbnail} price={product.price} />
          ))}
        </div>


        <div className="flex flex-col sm:flex-row justify-between items-center mt-5">
            <button
            onClick={() => handlePageChange(currentPage - 1 )}
            disabled={currentPage === 1}
            className="border px-4 py-2 mx-2 rounded-full"
            >
                Previous
            </button>

            <div className="flex flex-wrap justify-center">
                {getPaginationButton().map(page =>(
                    <button key={page} onClick={() => handlePageChange(page)}
                    className={`border px-4 py-2 mx-1 rounded-full ${
                    page === currentPage ? "bg-black text-white" : ""
                    }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage ===   totalPages}
            className="border px-4 py-2 mx-2 rounded-full"
            >
                Next
            </button>
        </div>
      </div>
    </section>
  );
};

export default MainContent;