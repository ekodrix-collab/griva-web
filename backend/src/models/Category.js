const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    href: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    banner_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Full-width hero banner image for this category page",
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categories",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "categories",
    timestamps: true,
  },
);

Category.associate = (models) => {
  Category.hasMany(models.SubCategory, {
    foreignKey: "category_id",
    as: "subcategories",
  });
};

module.exports = Category;
