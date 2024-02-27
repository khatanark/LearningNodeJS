class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filter(){
        const queryObj = {...this.queryString}; // this creates the new object instead of referece. 
        // const excludeFields = ['page', 'sort', 'limit', 'fields']
        // excludeFields.forEach(el => delete queryObj[el]) // we delete these query fields from query objects  http://localhost:3000/api/v1/tours?duration=5&difficulty=easy&sort=1&limit=10

        //1-B) Advance Filtering.
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryString));
        this.query = Tour.find(JSON.parse(queryString)); 
        return this;
    }

    sort(){
        if(this.queryString.sort){
            // http://localhost:3000/api/v1/tours?sort=price
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt'); // Default one.
        }
        return this;
    }

    limitFields(){
        if(this.queryString.fields){
            // http://localhost:3000/api/v1/tours?fields=name,duration,difficulty,price
            const fields = this.queryString.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v'); // Exclude only this field __v
        }
        return this;
    }

    paginate(){
        const page = this.queryString.page * 1 || 1  // converting string to numver.
        const limit = this.queryString.limit * 1 || 100; 
        const skip = (page-1) * limit;

        // page=2&limit=10 1-10 Page 1, 11-20 Page 2, 21-30 Page 3.Skip(10) we want to skip 10 results before starting querying.
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;