const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Products = require("./Prodschema");
const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

const db=process.env.MONGODB_URI;

//connection to mongo db
mongoose.set("strictQuery", false);
try {
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log("connected"));
} catch (error) {
  console.log("could not connect");
}




// mongoose
//   .connect(url)
//   .then(() => {
//     console.log("Connected to Database");
//   })
//   .catch((err) => {
//     console.log("Not Connected to Database ERROR! ", err);
//   });


// home route
app.get("/", (req, res) => {
  Products.find({ price: { $gt: 0 } }, (err, founds) => {
    if (err) {
      console.log(err);
    } else {
      console.log(founds);

      res.render("home", { founds: founds });
    }
  })
});

//add get route
app.get("/product/add", (req, res) => {
  res.render("create");
});

//add post product route
app.post("/product/add", (req, res) => {
  const id = mongoose.Types.ObjectId();
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  const ProductDetails = new Products({
    productId: id,
    name: req.body.name,
    price: req.body.price,
    featured: req.body.featured,
    rating: req.body.rating,
    createdOn: today,
    company: req.body.company,
  });

  ProductDetails.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("done");
    }
  });
  res.redirect("/");
});

//update get product route
app.get("/product/update/:productid", (req, res) => {
  const productId = req.params.productid;
  Products.find({ productId: productId }, (err, found) => {
    if (err) {
      console.log(err);
    } else {
      console.log(found);
      res.render("update", { productId: productId, name: found[0].name, price: found[0].price , company: found[0].company })
    }
  })
})

//update post product route
app.post("/product/update/:productid", (req, res) => {
  const productId = req.params.productid;
  const name = req.body.name;
  const price = req.body.price;
  const featured = req.body.featured;
  const rating = req.body.rating;
  const company = req.body.company;
  Products.findOneAndUpdate(
    { productId: productId },
    {
      $set: {
        name: name,
        price: price,
        featured: featured,
        rating: rating,
        company: company,
      },
    },
    (err, found) => {
      if (err) {
        console.log("update err");
      } else {
        console.log("Updated" + found);
      }
    }
  );
  res.status(400).send();
});

//delete get route
app.get("/product/delete/:productid", (req, res) => {
  const productId = req.params.productid;
  Products.find({ productId: productId }, (err, found) => {
    if (err) {
      console.log(err);
    } else {
      res.render("delete", { productId: found[0].productId });
    }
  })
})

//delete post route
app.post("/product/delete/:productid", (req, res) => {
  const productid = req.params.productid;
  Products.deleteOne({ productId: productid }, (err, found) => {
    if (err) {
      console.log("err");
    } else {
      console.log("deleted");
      res.redirect("/");
    }
  });
});

//filter according to price range
app.get("/product/filter/price/:range", (req, res) => {
  const range = req.params.range;
  if (range <= 1000) {
    Products.find({ price: { $lte: range } }, (err, founds) => {
      if (err) {
        console.log(err);
      } else {
        console.log(founds);
        res.render("filterprice", { range: founds.price, founds: founds })
      }
    });
  } else if (range > 1000 && range <= 500) {
    Products.find({ price: { $gt: range, $lte: range } }, (err, founds) => {
      if (err) {
        console.log(err);
      } else {
        console.log(founds);
        res.render("filterprice", { range: founds.price, founds: founds })
      }
    });
  } else {
    Products.find({ price: { $gt: range } }, (err, founds) => {
      if (err) {
        console.log(err);
      } else {
        console.log(founds);
        res.render("filterprice", { range: founds.price, founds: founds })
      }
    });
  }
});

//filter according to feature
app.get("/product/filter/bool/:featured", (req, res) => {
  let featured = req.params.featured;
  console.log(featured);
  Products.find({ featured: { $exists: featured } }, (err, founds) => {
    if (err) {
      console.log(err);
    } else {
      console.log(founds);
      res.render("filterfeature", { featured: founds.featured, founds: founds })
    }
  });
});

//filter according to rating 
app.get("/product/filter/rating/:rate", (req, res) => {
  let rate = req.params.rate;
  if (rate <= 1) {
    Products.find({ rating: { $lte: rate } }, (err, founds) => {
      if (err) {
        console.log(err);
      } else {
        console.log(founds);
        res.render("filter", { rating: founds.rating, founds: founds });
      }
    });
  } else if (rate == 2) {
    Products.find({ rating: { $eq: rate } }, (err, founds) => {
      if (err) {
        console.log(err);
      } else {
        console.log(founds);
        res.render("filter", { rating: founds.rating, founds: founds });
      }
    });
  } else if (rate == 3) {
    Products.find({ rating: { $eq: rate } }, (err, founds) => {
      if (err) {
        console.log(err);
      } else {
        console.log(founds);
        res.render("filter", { rating: founds.rating, founds: founds });
      }
    });
  } else if (rate == 4) {
    Products.find({ rating: { $eq: rate } }, (err, founds) => {
      if (err) {
        console.log(err);
      } else {
        console.log(founds);
        res.render("filter", { rating: founds.rating, founds: founds });
      }
    });
  } else {
    Products.find({ rating: { $eq: rate } }, (err, founds) => {
      if (err) {
        console.log(err);
      } else {
        console.log(founds);
        res.render("filter", { rating: founds.rating, founds: founds });
      }
    });
  }
});


//port running on
app.listen(3000, () => {
  console.log("sever connected to port 3000");
});
