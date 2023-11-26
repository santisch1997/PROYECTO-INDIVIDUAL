const { Driver } = require("../db");

const deleteDriverController = async (id) => {
    if (id) {
        const user = await Driver.findByPk(id);
        
        await user.destroy();
      }
  };
  
  module.exports = { deleteDriverController };

//   const jane = await User.create({ name: "Jane" });
// jane is now in the database
// await jane.destroy();
// Now this entry has been removed from the database
