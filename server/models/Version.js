export const Version = (sequelize, DataTypes) => {
    const Version = sequelize.define(
        "version",
        {
            value: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            inputAttributes: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: [],
            },
            outputAttributes: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: [],
            },
            condition: {
                type: DataTypes.JSON,
                defaultValue: { nodes: [], edges: [] },
            },
            version: {
                type: DataTypes.FLOAT,
                defaultValue: 1.0,
            },
        },
        { timestamps: true }
    );
    return Version;
};
