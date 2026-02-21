const Product = require('../models/Product');

(async function(){
  try{
    const prods = await Product.findAll({ limit: 50, offset: 0 });
    console.log('Products (model):', prods.map(p => ({ id: p.id, name: p.name })).slice(0,50));
    process.exit(0);
  }catch(err){
    console.error('Failed to list products via model:', err);
    process.exit(1);
  }
})();