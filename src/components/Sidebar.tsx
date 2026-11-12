import { useEffect, useState } from "react"
import { useFilter } from "./FilterContext"

interface Product {
    category: string 
}

interface FetchResponse {
    products: Product[]
}

export const Sidebar = () => {

    const{
         searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        minPrice,
        setMaxPrice,
        maxPrice,
        setMinPrice,
        keyword,
        setKeyword,
    } = useFilter();

    const [categories, setCategories] = useState<string[]>([]);
    const [keywords] = useState<string[]>([
        "apple",
        "watch",
        "fashion",
        "trend",
        "shoes",
        "shirt", 
    ])

    useEffect (() =>{
        const fetchCategories = async () => {
            try{
                const response = await fetch('https://dummyjson.com/products')
                const data:  FetchResponse  = await response.json()
                const uniqueCategories = Array.from(
                    new Set(data.products.map((product) => product.category))
                );
                setCategories(uniqueCategories)
                // console.log(data)
            }
            catch (error){
                console.error("Error fetching product", error )

            }
        };

        fetchCategories();

    }, [])

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valua = e.target.value;
        setMinPrice(valua ? parseFloat(valua) : undefined);
    }

    
    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valua = e.target.value;
        setMinPrice(valua ? parseFloat(valua) : undefined);
    };

    const handleRadioChangeCategories = (category: string) => {
        setSelectedCategory(category)
    };

    const handleKeywordClick = (keyword: string) => {
        setKeyword(keyword);
    };

    const handleResetFilter  = () => {
        setSearchQuery(''),
        setSelectedCategory('')
        setMinPrice(undefined)
        setMaxPrice(undefined)
        setKeyword('')
    }

  return (
    <div className="min-h-screen w-64 p-5">
        <h1 className="mb-6 mt-4 text-2xl font-bold">
            React Store
        </h1>
        <section>
            <input type="text"
            className="mb-2 w-full rounded border px-2 py-1"
            placeholder="Search Product"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
             />
                 <div className="mb-4 flex items-center gap-2">
                     <input type="text" className="w-1/2 rounded border px-3 py-2" placeholder="Min"
                     value={minPrice ?? ''}
                     onChange={handleMinPriceChange}/>
                     <input type="text" className="w-1/2 rounded border px-3 py-2" placeholder="Max"
                     value={maxPrice ?? ''}
                     onChange={handleMaxPriceChange}/>
                </div>
                {/* Categories */}

                <div className="mb-2">
                    <h2 className="mb-2 text-xl font-semibold">Categories</h2>  
                </div>

                <section>
                {categories.map((category, index) => (
                    <label className="mb-2 block" key={index}>
                        <input type="radio" name="category"
                         value={category}
                         onChange={() => handleRadioChangeCategories(category)} 
                         checked ={ selectedCategory === category}
                        className="mr-2 h-4 w-4"/>
                        {category.toUpperCase()}
                    </label>
                ))}
                </section>
                {/* Keywords Words */}

                <div className="mb-5 mt-4">
                    <h2 className="mb-2 text-xl font-semibold">Keywords</h2>
                    <div>
                        {keywords.map((keyword, index) => (
                            <button key={index} 
                            onClick={() => handleKeywordClick(keyword)}
                            className="mb-2 block w-full rounded  px-3 py-2 text-left hover:bg-gray-200">
                                {keyword.toUpperCase()}

                            </button>
                        ))}
                    </div>
                </div>

                <button
                onClick={handleResetFilter}
                className="mt-5 w-full rounded bg-black py-2 text-white">
                    Reset Filters
                </button>
                
        </section>
    </div>
  )
}
