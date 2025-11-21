-- =====================================================
-- Database Migration: Initial Schema
-- =====================================================
-- IMPORTANT: Always use [dbo] schema in this file.
-- The migration-runner will automatically replace [dbo] with [project_foodtrack]
-- at runtime based on the PROJECT_ID environment variable.
-- DO NOT hardcode [project_XXX] - always use [dbo]!
-- DO NOT create schema here - migration-runner creates it programmatically.
--
-- NAMING CONVENTION (CRITICAL):
-- Use camelCase for ALL column names to align with JavaScript/TypeScript frontend
-- CORRECT: [userId], [createdAt], [firstName]
-- WRONG: [user_id], [created_at], [first_name]
-- Exception: [id] is always lowercase
-- =====================================================

-- =====================================================
-- TABLES
-- =====================================================

/**
 * @table purchase Brief table for food purchase records
 * @multitenancy true
 * @softDelete false
 * @alias prc
 */
CREATE TABLE [dbo].[purchase] (
  [id] INT IDENTITY(1,1) NOT NULL,
  [idAccount] INT NOT NULL,
  [productName] NVARCHAR(100) NOT NULL,
  [quantity] NUMERIC(5,2) NOT NULL,
  [measurementUnit] VARCHAR(20) NOT NULL,
  [unitPrice] NUMERIC(18,6) NOT NULL,
  [totalValue] NUMERIC(18,6) NOT NULL,
  [purchaseDate] DATE NOT NULL,
  [category] NVARCHAR(50) NOT NULL,
  [purchaseLocation] NVARCHAR(100) NULL,
  [notes] NVARCHAR(500) NULL,
  [createdAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
  [updatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

/**
 * @primaryKey pkPurchase
 * @keyType Object
 */
ALTER TABLE [dbo].[purchase]
ADD CONSTRAINT [pkPurchase] PRIMARY KEY CLUSTERED ([id]);
GO

/**
 * @check chkPurchase_Quantity
 * @enum {>0} Quantity must be greater than zero
 */
ALTER TABLE [dbo].[purchase]
ADD CONSTRAINT [chkPurchase_Quantity] CHECK ([quantity] > 0);
GO

/**
 * @check chkPurchase_MeasurementUnit
 * @enum {kg} Kilogram
 * @enum {g} Gram
 * @enum {l} Liter
 * @enum {ml} Milliliter
 * @enum {unidade} Unit
 * @enum {pacote} Package
 * @enum {caixa} Box
 * @enum {duzia} Dozen
 */
ALTER TABLE [dbo].[purchase]
ADD CONSTRAINT [chkPurchase_MeasurementUnit] CHECK ([measurementUnit] IN ('kg', 'g', 'l', 'ml', 'unidade', 'pacote', 'caixa', 'duzia'));
GO

/**
 * @check chkPurchase_UnitPrice
 * @enum {>=0} Unit price must be greater than or equal to zero
 */
ALTER TABLE [dbo].[purchase]
ADD CONSTRAINT [chkPurchase_UnitPrice] CHECK ([unitPrice] >= 0);
GO

/**
 * @check chkPurchase_Category
 * @enum {Frutas} Fruits
 * @enum {Verduras} Vegetables
 * @enum {Carnes} Meats
 * @enum {Laticínios} Dairy
 * @enum {Grãos} Grains
 * @enum {Bebidas} Beverages
 * @enum {Congelados} Frozen
 * @enum {Padaria} Bakery
 * @enum {Outros} Others
 */
ALTER TABLE [dbo].[purchase]
ADD CONSTRAINT [chkPurchase_Category] CHECK ([category] IN ('Frutas', 'Verduras', 'Carnes', 'Laticínios', 'Grãos', 'Bebidas', 'Congelados', 'Padaria', 'Outros'));
GO

/**
 * @table purchaseAuditLog Audit log for purchase deletions
 * @multitenancy true
 * @softDelete false
 * @alias prcAud
 */
CREATE TABLE [dbo].[purchaseAuditLog] (
  [id] INT IDENTITY(1,1) NOT NULL,
  [idAccount] INT NOT NULL,
  [idPurchase] INT NOT NULL,
  [productName] NVARCHAR(100) NOT NULL,
  [totalValue] NUMERIC(18,6) NOT NULL,
  [purchaseDate] DATE NOT NULL,
  [deletedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
  [deletedBy] INT NOT NULL
);
GO

/**
 * @primaryKey pkPurchaseAuditLog
 * @keyType Object
 */
ALTER TABLE [dbo].[purchaseAuditLog]
ADD CONSTRAINT [pkPurchaseAuditLog] PRIMARY KEY CLUSTERED ([id]);
GO

-- =====================================================
-- INDEXES
-- =====================================================

/**
 * @index ixPurchase_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixPurchase_Account]
ON [dbo].[purchase]([idAccount]);
GO

/**
 * @index ixPurchase_Account_PurchaseDate
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixPurchase_Account_PurchaseDate]
ON [dbo].[purchase]([idAccount], [purchaseDate]);
GO

/**
 * @index ixPurchase_Account_Category
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixPurchase_Account_Category]
ON [dbo].[purchase]([idAccount], [category]);
GO

/**
 * @index ixPurchaseAuditLog_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixPurchaseAuditLog_Account]
ON [dbo].[purchaseAuditLog]([idAccount]);
GO

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

/**
 * @summary
 * Creates a new purchase record with automatic total value calculation
 * 
 * @procedure spPurchaseCreate
 * @schema dbo
 * @type stored-procedure
 * 
 * @endpoints
 * - POST /api/v1/internal/purchase
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier
 * @param {NVARCHAR(100)} productName
 *   - Required: Yes
 *   - Description: Name of the food product
 * @param {NUMERIC(5,2)} quantity
 *   - Required: Yes
 *   - Description: Quantity purchased
 * @param {VARCHAR(20)} measurementUnit
 *   - Required: Yes
 *   - Description: Unit of measurement
 * @param {NUMERIC(18,6)} unitPrice
 *   - Required: Yes
 *   - Description: Price per unit
 * @param {DATE} purchaseDate
 *   - Required: Yes
 *   - Description: Date of purchase
 * @param {NVARCHAR(50)} category
 *   - Required: Yes
 *   - Description: Food category
 * @param {NVARCHAR(100)} purchaseLocation
 *   - Required: No
 *   - Description: Store or location of purchase
 * @param {NVARCHAR(500)} notes
 *   - Required: No
 *   - Description: Additional notes
 * 
 * @returns {INT} id - Created purchase identifier
 * 
 * @testScenarios
 * - Valid creation with all required parameters
 * - Validation of product name length
 * - Validation of quantity greater than zero
 * - Validation of valid measurement unit
 * - Validation of non-negative unit price
 * - Validation of non-future purchase date
 * - Validation of valid category
 * - Automatic total value calculation
 */
CREATE OR ALTER PROCEDURE [dbo].[spPurchaseCreate]
  @idAccount INT,
  @idUser INT,
  @productName NVARCHAR(100),
  @quantity NUMERIC(5,2),
  @measurementUnit VARCHAR(20),
  @unitPrice NUMERIC(18,6),
  @purchaseDate DATE,
  @category NVARCHAR(50),
  @purchaseLocation NVARCHAR(100) = NULL,
  @notes NVARCHAR(500) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {productNameRequired}
   */
  IF @productName IS NULL OR LEN(RTRIM(@productName)) = 0
  BEGIN
    ;THROW 51000, 'productNameRequired', 1;
  END;

  /**
   * @validation Product name minimum length
   * @throw {productNameMinLength}
   */
  IF LEN(RTRIM(@productName)) < 3
  BEGIN
    ;THROW 51000, 'productNameMinLength', 1;
  END;

  /**
   * @validation Quantity validation
   * @throw {quantityRequired}
   */
  IF @quantity IS NULL
  BEGIN
    ;THROW 51000, 'quantityRequired', 1;
  END;

  /**
   * @validation Quantity must be positive
   * @throw {quantityMustBePositive}
   */
  IF @quantity <= 0
  BEGIN
    ;THROW 51000, 'quantityMustBePositive', 1;
  END;

  /**
   * @validation Measurement unit validation
   * @throw {measurementUnitRequired}
   */
  IF @measurementUnit IS NULL
  BEGIN
    ;THROW 51000, 'measurementUnitRequired', 1;
  END;

  /**
   * @validation Unit price validation
   * @throw {unitPriceRequired}
   */
  IF @unitPrice IS NULL
  BEGIN
    ;THROW 51000, 'unitPriceRequired', 1;
  END;

  /**
   * @validation Unit price must be non-negative
   * @throw {unitPriceNonNegative}
   */
  IF @unitPrice < 0
  BEGIN
    ;THROW 51000, 'unitPriceNonNegative', 1;
  END;

  /**
   * @validation Purchase date validation
   * @throw {purchaseDateRequired}
   */
  IF @purchaseDate IS NULL
  BEGIN
    ;THROW 51000, 'purchaseDateRequired', 1;
  END;

  /**
   * @validation Purchase date cannot be future
   * @throw {purchaseDateCannotBeFuture}
   */
  IF @purchaseDate > CAST(GETUTCDATE() AS DATE)
  BEGIN
    ;THROW 51000, 'purchaseDateCannotBeFuture', 1;
  END;

  /**
   * @validation Category validation
   * @throw {categoryRequired}
   */
  IF @category IS NULL
  BEGIN
    ;THROW 51000, 'categoryRequired', 1;
  END;

  DECLARE @totalValue NUMERIC(18,6);
  DECLARE @newId INT;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {fn-order-processing} Calculate total value automatically
       */
      SET @totalValue = @quantity * @unitPrice;

      INSERT INTO [dbo].[purchase] (
        [idAccount],
        [productName],
        [quantity],
        [measurementUnit],
        [unitPrice],
        [totalValue],
        [purchaseDate],
        [category],
        [purchaseLocation],
        [notes],
        [createdAt],
        [updatedAt]
      )
      VALUES (
        @idAccount,
        @productName,
        @quantity,
        @measurementUnit,
        @unitPrice,
        @totalValue,
        @purchaseDate,
        @category,
        @purchaseLocation,
        @notes,
        GETUTCDATE(),
        GETUTCDATE()
      );

      SET @newId = SCOPE_IDENTITY();

      /**
       * @output {PurchaseCreated, 1, 1}
       * @column {INT} id
       * - Description: Created purchase identifier
       */
      SELECT @newId AS [id];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

/**
 * @summary
 * Retrieves a single purchase record by ID
 * 
 * @procedure spPurchaseGet
 * @schema dbo
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/purchase/:id
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 * @param {INT} id
 *   - Required: Yes
 *   - Description: Purchase identifier
 * 
 * @testScenarios
 * - Valid retrieval with existing ID
 * - Purchase not found scenario
 * - Account isolation validation
 */
CREATE OR ALTER PROCEDURE [dbo].[spPurchaseGet]
  @idAccount INT,
  @id INT
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Purchase ID validation
   * @throw {purchaseIdRequired}
   */
  IF @id IS NULL
  BEGIN
    ;THROW 51000, 'purchaseIdRequired', 1;
  END;

  /**
   * @validation Purchase existence check
   * @throw {purchaseNotFound}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [dbo].[purchase] prc
    WHERE prc.[id] = @id
      AND prc.[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'purchaseNotFound', 1;
  END;

  /**
   * @output {PurchaseDetail, 1, n}
   * @column {INT} id
   * - Description: Purchase identifier
   * @column {NVARCHAR} productName
   * - Description: Product name
   * @column {NUMERIC} quantity
   * - Description: Quantity purchased
   * @column {VARCHAR} measurementUnit
   * - Description: Unit of measurement
   * @column {NUMERIC} unitPrice
   * - Description: Price per unit
   * @column {NUMERIC} totalValue
   * - Description: Total purchase value
   * @column {DATE} purchaseDate
   * - Description: Date of purchase
   * @column {NVARCHAR} category
   * - Description: Food category
   * @column {NVARCHAR} purchaseLocation
   * - Description: Store or location
   * @column {NVARCHAR} notes
   * - Description: Additional notes
   * @column {DATETIME2} createdAt
   * - Description: Creation timestamp
   * @column {DATETIME2} updatedAt
   * - Description: Last update timestamp
   */
  SELECT
    prc.[id],
    prc.[productName],
    prc.[quantity],
    prc.[measurementUnit],
    prc.[unitPrice],
    prc.[totalValue],
    prc.[purchaseDate],
    prc.[category],
    prc.[purchaseLocation],
    prc.[notes],
    prc.[createdAt],
    prc.[updatedAt]
  FROM [dbo].[purchase] prc
  WHERE prc.[id] = @id
    AND prc.[idAccount] = @idAccount;
END;
GO

/**
 * @summary
 * Lists purchases with optional filters and calculates monthly total
 * 
 * @procedure spPurchaseList
 * @schema dbo
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/purchase
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 * @param {DATE} startDate
 *   - Required: No
 *   - Description: Filter start date
 * @param {DATE} endDate
 *   - Required: No
 *   - Description: Filter end date
 * @param {NVARCHAR(50)} category
 *   - Required: No
 *   - Description: Filter by category
 * @param {NUMERIC(18,6)} minValue
 *   - Required: No
 *   - Description: Minimum total value filter
 * @param {NUMERIC(18,6)} maxValue
 *   - Required: No
 *   - Description: Maximum total value filter
 * @param {VARCHAR(50)} sortBy
 *   - Required: No
 *   - Description: Sort criteria
 * 
 * @testScenarios
 * - List all purchases for current month
 * - Filter by date range
 * - Filter by category
 * - Filter by value range
 * - Sort by different criteria
 * - Calculate monthly total correctly
 */
CREATE OR ALTER PROCEDURE [dbo].[spPurchaseList]
  @idAccount INT,
  @startDate DATE = NULL,
  @endDate DATE = NULL,
  @category NVARCHAR(50) = NULL,
  @minValue NUMERIC(18,6) = NULL,
  @maxValue NUMERIC(18,6) = NULL,
  @sortBy VARCHAR(50) = 'date_desc'
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Date range validation
   * @throw {endDateBeforeStartDate}
   */
  IF (@startDate IS NOT NULL AND @endDate IS NOT NULL AND @endDate < @startDate)
  BEGIN
    ;THROW 51000, 'endDateBeforeStartDate', 1;
  END;

  /**
   * @validation Value range validation
   * @throw {maxValueLessThanMinValue}
   */
  IF (@minValue IS NOT NULL AND @maxValue IS NOT NULL AND @maxValue < @minValue)
  BEGIN
    ;THROW 51000, 'maxValueLessThanMinValue', 1;
  END;

  /**
   * @rule {fn-order-processing} Default to current month if no date filters
   */
  IF @startDate IS NULL AND @endDate IS NULL
  BEGIN
    SET @startDate = DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1);
    SET @endDate = EOMONTH(GETUTCDATE());
  END;

  /**
   * @output {PurchaseList, n, n}
   * @column {INT} id
   * - Description: Purchase identifier
   * @column {NVARCHAR} productName
   * - Description: Product name
   * @column {NUMERIC} quantity
   * - Description: Quantity purchased
   * @column {VARCHAR} measurementUnit
   * - Description: Unit of measurement
   * @column {NUMERIC} unitPrice
   * - Description: Price per unit
   * @column {NUMERIC} totalValue
   * - Description: Total purchase value
   * @column {DATE} purchaseDate
   * - Description: Date of purchase
   * @column {NVARCHAR} category
   * - Description: Food category
   * @column {NVARCHAR} purchaseLocation
   * - Description: Store or location
   * @column {DATETIME2} updatedAt
   * - Description: Last update timestamp
   */
  SELECT
    prc.[id],
    prc.[productName],
    prc.[quantity],
    prc.[measurementUnit],
    prc.[unitPrice],
    prc.[totalValue],
    prc.[purchaseDate],
    prc.[category],
    prc.[purchaseLocation],
    prc.[updatedAt]
  FROM [dbo].[purchase] prc
  WHERE prc.[idAccount] = @idAccount
    AND (@startDate IS NULL OR prc.[purchaseDate] >= @startDate)
    AND (@endDate IS NULL OR prc.[purchaseDate] <= @endDate)
    AND (@category IS NULL OR @category = 'Todas' OR prc.[category] = @category)
    AND (@minValue IS NULL OR prc.[totalValue] >= @minValue)
    AND (@maxValue IS NULL OR prc.[totalValue] <= @maxValue)
  ORDER BY
    CASE WHEN @sortBy = 'date_desc' THEN prc.[purchaseDate] END DESC,
    CASE WHEN @sortBy = 'date_asc' THEN prc.[purchaseDate] END ASC,
    CASE WHEN @sortBy = 'value_desc' THEN prc.[totalValue] END DESC,
    CASE WHEN @sortBy = 'value_asc' THEN prc.[totalValue] END ASC,
    CASE WHEN @sortBy = 'name_asc' THEN prc.[productName] END ASC,
    CASE WHEN @sortBy = 'name_desc' THEN prc.[productName] END DESC,
    prc.[purchaseDate] DESC;

  /**
   * @output {MonthlyTotal, 1, n}
   * @column {NUMERIC} totalValue
   * - Description: Total value for filtered period
   * @column {DATE} periodStart
   * - Description: Start date of period
   * @column {DATE} periodEnd
   * - Description: End date of period
   */
  SELECT
    ISNULL(SUM(prc.[totalValue]), 0) AS [totalValue],
    @startDate AS [periodStart],
    @endDate AS [periodEnd]
  FROM [dbo].[purchase] prc
  WHERE prc.[idAccount] = @idAccount
    AND (@startDate IS NULL OR prc.[purchaseDate] >= @startDate)
    AND (@endDate IS NULL OR prc.[purchaseDate] <= @endDate)
    AND (@category IS NULL OR @category = 'Todas' OR prc.[category] = @category)
    AND (@minValue IS NULL OR prc.[totalValue] >= @minValue)
    AND (@maxValue IS NULL OR prc.[totalValue] <= @maxValue);

  /**
   * @output {CategoryTotals, n, n}
   * @column {NVARCHAR} category
   * - Description: Food category
   * @column {NUMERIC} totalValue
   * - Description: Total value for category
   */
  SELECT
    prc.[category],
    SUM(prc.[totalValue]) AS [totalValue]
  FROM [dbo].[purchase] prc
  WHERE prc.[idAccount] = @idAccount
    AND (@startDate IS NULL OR prc.[purchaseDate] >= @startDate)
    AND (@endDate IS NULL OR prc.[purchaseDate] <= @endDate)
    AND (@category IS NULL OR @category = 'Todas' OR prc.[category] = @category)
    AND (@minValue IS NULL OR prc.[totalValue] >= @minValue)
    AND (@maxValue IS NULL OR prc.[totalValue] <= @maxValue)
  GROUP BY prc.[category]
  ORDER BY SUM(prc.[totalValue]) DESC;
END;
GO

/**
 * @summary
 * Updates an existing purchase record
 * 
 * @procedure spPurchaseUpdate
 * @schema dbo
 * @type stored-procedure
 * 
 * @endpoints
 * - PUT /api/v1/internal/purchase/:id
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 * @param {INT} id
 *   - Required: Yes
 *   - Description: Purchase identifier
 * @param {NVARCHAR(100)} productName
 *   - Required: Yes
 *   - Description: Name of the food product
 * @param {NUMERIC(5,2)} quantity
 *   - Required: Yes
 *   - Description: Quantity purchased
 * @param {VARCHAR(20)} measurementUnit
 *   - Required: Yes
 *   - Description: Unit of measurement
 * @param {NUMERIC(18,6)} unitPrice
 *   - Required: Yes
 *   - Description: Price per unit
 * @param {DATE} purchaseDate
 *   - Required: Yes
 *   - Description: Date of purchase
 * @param {NVARCHAR(50)} category
 *   - Required: Yes
 *   - Description: Food category
 * @param {NVARCHAR(100)} purchaseLocation
 *   - Required: No
 *   - Description: Store or location of purchase
 * @param {NVARCHAR(500)} notes
 *   - Required: No
 *   - Description: Additional notes
 * 
 * @testScenarios
 * - Valid update with all parameters
 * - Purchase not found scenario
 * - Validation of all field constraints
 * - Automatic total value recalculation
 * - Updated timestamp update
 */
CREATE OR ALTER PROCEDURE [dbo].[spPurchaseUpdate]
  @idAccount INT,
  @id INT,
  @productName NVARCHAR(100),
  @quantity NUMERIC(5,2),
  @measurementUnit VARCHAR(20),
  @unitPrice NUMERIC(18,6),
  @purchaseDate DATE,
  @category NVARCHAR(50),
  @purchaseLocation NVARCHAR(100) = NULL,
  @notes NVARCHAR(500) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Purchase ID validation
   * @throw {purchaseIdRequired}
   */
  IF @id IS NULL
  BEGIN
    ;THROW 51000, 'purchaseIdRequired', 1;
  END;

  /**
   * @validation Purchase existence check
   * @throw {purchaseNotFound}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [dbo].[purchase] prc
    WHERE prc.[id] = @id
      AND prc.[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'purchaseNotFound', 1;
  END;

  /**
   * @validation Product name validation
   * @throw {productNameRequired}
   */
  IF @productName IS NULL OR LEN(RTRIM(@productName)) = 0
  BEGIN
    ;THROW 51000, 'productNameRequired', 1;
  END;

  /**
   * @validation Product name minimum length
   * @throw {productNameMinLength}
   */
  IF LEN(RTRIM(@productName)) < 3
  BEGIN
    ;THROW 51000, 'productNameMinLength', 1;
  END;

  /**
   * @validation Quantity validation
   * @throw {quantityRequired}
   */
  IF @quantity IS NULL
  BEGIN
    ;THROW 51000, 'quantityRequired', 1;
  END;

  /**
   * @validation Quantity must be positive
   * @throw {quantityMustBePositive}
   */
  IF @quantity <= 0
  BEGIN
    ;THROW 51000, 'quantityMustBePositive', 1;
  END;

  /**
   * @validation Measurement unit validation
   * @throw {measurementUnitRequired}
   */
  IF @measurementUnit IS NULL
  BEGIN
    ;THROW 51000, 'measurementUnitRequired', 1;
  END;

  /**
   * @validation Unit price validation
   * @throw {unitPriceRequired}
   */
  IF @unitPrice IS NULL
  BEGIN
    ;THROW 51000, 'unitPriceRequired', 1;
  END;

  /**
   * @validation Unit price must be non-negative
   * @throw {unitPriceNonNegative}
   */
  IF @unitPrice < 0
  BEGIN
    ;THROW 51000, 'unitPriceNonNegative', 1;
  END;

  /**
   * @validation Purchase date validation
   * @throw {purchaseDateRequired}
   */
  IF @purchaseDate IS NULL
  BEGIN
    ;THROW 51000, 'purchaseDateRequired', 1;
  END;

  /**
   * @validation Purchase date cannot be future
   * @throw {purchaseDateCannotBeFuture}
   */
  IF @purchaseDate > CAST(GETUTCDATE() AS DATE)
  BEGIN
    ;THROW 51000, 'purchaseDateCannotBeFuture', 1;
  END;

  /**
   * @validation Category validation
   * @throw {categoryRequired}
   */
  IF @category IS NULL
  BEGIN
    ;THROW 51000, 'categoryRequired', 1;
  END;

  DECLARE @totalValue NUMERIC(18,6);

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {fn-order-processing} Recalculate total value
       */
      SET @totalValue = @quantity * @unitPrice;

      UPDATE [dbo].[purchase]
      SET
        [productName] = @productName,
        [quantity] = @quantity,
        [measurementUnit] = @measurementUnit,
        [unitPrice] = @unitPrice,
        [totalValue] = @totalValue,
        [purchaseDate] = @purchaseDate,
        [category] = @category,
        [purchaseLocation] = @purchaseLocation,
        [notes] = @notes,
        [updatedAt] = GETUTCDATE()
      WHERE [id] = @id
        AND [idAccount] = @idAccount;

      /**
       * @output {PurchaseUpdated, 1, 1}
       * @column {INT} id
       * - Description: Updated purchase identifier
       */
      SELECT @id AS [id];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

/**
 * @summary
 * Deletes a purchase record and logs the deletion for audit
 * 
 * @procedure spPurchaseDelete
 * @schema dbo
 * @type stored-procedure
 * 
 * @endpoints
 * - DELETE /api/v1/internal/purchase/:id
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User performing deletion
 * @param {INT} id
 *   - Required: Yes
 *   - Description: Purchase identifier
 * 
 * @testScenarios
 * - Valid deletion with existing ID
 * - Purchase not found scenario
 * - Audit log creation verification
 * - Account isolation validation
 */
CREATE OR ALTER PROCEDURE [dbo].[spPurchaseDelete]
  @idAccount INT,
  @idUser INT,
  @id INT
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Purchase ID validation
   * @throw {purchaseIdRequired}
   */
  IF @id IS NULL
  BEGIN
    ;THROW 51000, 'purchaseIdRequired', 1;
  END;

  /**
   * @validation Purchase existence check
   * @throw {purchaseNotFound}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [dbo].[purchase] prc
    WHERE prc.[id] = @id
      AND prc.[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'purchaseNotFound', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {fn-order-processing} Log deletion for audit trail
       */
      INSERT INTO [dbo].[purchaseAuditLog] (
        [idAccount],
        [idPurchase],
        [productName],
        [totalValue],
        [purchaseDate],
        [deletedAt],
        [deletedBy]
      )
      SELECT
        prc.[idAccount],
        prc.[id],
        prc.[productName],
        prc.[totalValue],
        prc.[purchaseDate],
        GETUTCDATE(),
        @idUser
      FROM [dbo].[purchase] prc
      WHERE prc.[id] = @id
        AND prc.[idAccount] = @idAccount;

      DELETE FROM [dbo].[purchase]
      WHERE [id] = @id
        AND [idAccount] = @idAccount;

      /**
       * @output {PurchaseDeleted, 1, 1}
       * @column {INT} id
       * - Description: Deleted purchase identifier
       */
      SELECT @id AS [id];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO