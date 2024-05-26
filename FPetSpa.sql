CREATE DATABASE [FpetSpa]
GO
USE [FpetSpa]
GO
--DROP DATABASE [FpetSpa]
CREATE TABLE [Category] (
  [CategoryID] nvarchar(20),
  [CategoryName] nvarchar(20),
  [Description] nvarchar(100) null,
  PRIMARY KEY ([CategoryID])
);

CREATE TABLE [Product] (
  [ProductID] nvarchar(20),
  [ProductName] nvarchar(50),
  [PictureName] nvarchar(50) null,
  [CategoryID] nvarchar(20),
  [ProductDescription] nvarchar(300) null,
  [ProductQuantity] int,
  [Price] money,
  PRIMARY KEY ([ProductID]),
  CONSTRAINT [FK_Product.CategoryID]
    FOREIGN KEY ([CategoryID])
      REFERENCES [Category]([CategoryID])
);

CREATE TABLE [Staff] (
  [StaffID] int,
  [UserName] varchar(20),
  [Password] nvarchar(20),
  [FirstName] nvarchar(20),
  [LastName] nvarchar(20),
  [Birthday] date null,
  [Role] int,
  [PictureName] nvarchar(50) null,
  PRIMARY KEY ([StaffID]),
);

CREATE TABLE [Customer] (
  [CustomerID] int ,
  [PictureName] nvarchar(50) null,
  [UserName] varchar(20),
  [Name] nvarchar(20),
  [Password] nvarchar(20),
  [Address] nvarchar(20) null,
  [Phone] decimal(10,0),
  [Coupon] float null,
  [Status] bit,
  PRIMARY KEY ([CustomerID])
);

CREATE TABLE [Voucher] (
  [VoucherID] nvarchar(20),
  [Description] nvarchar(100),
  [StartDate] date,
  [EndDate] date,
  PRIMARY KEY ([VoucherID])
);

CREATE TABLE [PaymentMethod] (
  [MethodID] int,
  [MethodName] nvarchar(20),
  [MethodAPI] nvarchar(100),
  [Tax] float,
  PRIMARY KEY ([MethodID])
);

CREATE TABLE [Transactions] (
  [TransactionID] nvarchar(20),
  [Status] int,
  [TransactionDate] date,
  [MethodID] int,
  PRIMARY KEY ([TransactionID]),
  CONSTRAINT [FK_Transactions.MethodID]
    FOREIGN KEY ([MethodID])
      REFERENCES [PaymentMethod]([MethodID])
);


CREATE TABLE [Order] (
  [OrderID] nvarchar(20),
  [CustomerID] int,
  [StaffID] int,
  [GuestID] int,
  [RequiredDate] date,
  [Total] decimal(20,2),
  [VoucherID] nvarchar(20),
  [TransactionID] nvarchar(20),
  PRIMARY KEY ([OrderID]),
  CONSTRAINT [FK_Order.StaffID]
    FOREIGN KEY ([StaffID])
      REFERENCES [Staff]([StaffID]),
  CONSTRAINT [FK_Order.CustomerID]
    FOREIGN KEY ([CustomerID])
      REFERENCES [Customer]([CustomerID]),
  CONSTRAINT [FK_Order.VoucherID]
    FOREIGN KEY ([VoucherID])
      REFERENCES [Voucher]([VoucherID]),
  CONSTRAINT [FK_Order.TransactionID]
    FOREIGN KEY ([TransactionID])
      REFERENCES [Transactions]([TransactionID])
);

CREATE TABLE [FeedBack] (
  [FeedBackID] int,
  [OrderID] nvarchar(20),
  [PictureName] nvarchar(50),
  [Star] int,
  [Description] nvarchar(300),
  PRIMARY KEY ([FeedBackID]),
  CONSTRAINT [FK_FeedBack.OrderID]
    FOREIGN KEY ([OrderID])
      REFERENCES [Order]([OrderID])
);

CREATE INDEX [Fk] ON  [Order] ([GuestID]);

CREATE TABLE [ProductOrderDetails] (
  [ProductOrderID] nvarchar(20),
  [OrderID] nvarchar(20),
  [ProductId] nvarchar(20),
  [Quantity] int,
  [Price] money,
  [Discount] float null,
  CONSTRAINT [FK_ProductOrderDetails.ProductId]
    FOREIGN KEY ([ProductId])
      REFERENCES [Product]([ProductID]),
  CONSTRAINT [FK_ProductOrderDetails.OrderID]
    FOREIGN KEY ([OrderID])
      REFERENCES [Order]([OrderID]),


);



CREATE TABLE [Pet] (
  [PetID] int,
  [CustomerID] int,
  [Pet Name] varchar(20),
  [PictureName] nvarchar(50),
  [Pet Gender] varchar(10),
  [Pet Type] varchar(20),
  [Pet Weight] decimal(9,2),
  PRIMARY KEY ([PetID]),
  CONSTRAINT [FK_Pet.CustomerID]
    FOREIGN KEY ([CustomerID])
      REFERENCES [Customer]([CustomerID])
);

CREATE TABLE [Service] (
  [ServiceID] nvarchar(20),
  [PictureName] nvarchar(50) null,
  [ServiceName] nvarchar(50),
  [MinWeight] decimal(5,3),
  [MaxWeight] decimal(6,3),
  [Description] nvarchar(300),
  [Price] money,
  [StartDate] datetime null,
  [EndDate] datetime null,
  [Status] int,
  PRIMARY KEY ([ServiceID])
);

CREATE TABLE [ServiceOrderDetails] (
  [ServiceOrderID] nvarchar(20),
  [ServiceID] nvarchar(20),
  [OrderID] nvarchar(20),
  [Discount] float null,
  [PetWeight] decimal(5,3),
  [Price] money,
  [PetID] int,
  CONSTRAINT [FK_ServiceOrderDetails.OrderID]
    FOREIGN KEY ([OrderID])
      REFERENCES [Order]([OrderID]),
  CONSTRAINT [FK_ServiceOrderDetails.PetID]
    FOREIGN KEY ([PetID])
      REFERENCES [Pet]([PetID]),
  CONSTRAINT [FK_ServiceOrderDetails.ServiceID]
    FOREIGN KEY ([ServiceID])
      REFERENCES [Service]([ServiceID])
);





----------------/////////////////////////////////////////////////////////////////////////////////////////////--------------------




---Category---
INSERT INTO [Category] VALUES ('CA01', 'Balo', '');
INSERT INTO [Category] VALUES ('CA02', 'Clumping pet', '');
INSERT INTO [Category] VALUES ('CA03', 'Cake', '');
INSERT INTO [Category] VALUES ('CA04', 'Necklace', '');
INSERT INTO [Category] VALUES ('CA05', 'Foods', '');
INSERT INTO [Category] VALUES ('CA06', 'Shower gel', '');
 GO
---Product---
INSERT INTO [Product] VALUES ('PRO01', 'Pate MasterCare', 'Pate-400G-Ngu-Bo.jpg',  'CA05', N'Pate MasterCare được nghiên cứu và sản xuất từ những nguyên liệu dinh dưỡng, đảm bảo an toàn cho sức khoẻ chó mèo.', 10 , 100.000);
INSERT INTO [Product] VALUES ('PRO02', 'Pate Nature`s Recipe', 'food-2.png',  'CA05', 'No matter the life stage or nutritional needs, Nature’s Recipe® dog food is carefully crafted with pet nutritionist input using wholesome, natural ingredients with added vitamins, minerals and nutrients.', 10 , 75.000);
INSERT INTO [Product] VALUES ('PRO03', 'Super premium dog food VEGAN', 'food-3.png',  'CA05', 'No matter the life stage or nutritional needs, Nature’s Recipe® dog food is carefully crafted with pet nutritionist input using wholesome, natural ingredients with added vitamins, minerals and nutrients.', 10 , 50.000);
INSERT INTO [Product] VALUES ('PRO04', 'Fresh Turkey Sumply', 'food-4.png',  'CA05', 'No matter the life stage or nutritional needs, Nature’s Recipe® dog food is carefully crafted with pet nutritionist input using wholesome, natural ingredients with added vitamins, minerals and nutrients.', 10 , 120.000);
INSERT INTO [Product] VALUES ('PRO05', 'Food Square Pet VFS', 'food-5.png',  'CA05', 'No matter the life stage or nutritional needs, Nature’s Recipe® dog food is carefully crafted with pet nutritionist input using wholesome, natural ingredients with added vitamins, minerals and nutrients.', 10 , 150.000);
GO
---Staff---
INSERT INTO [Staff] VALUES (1,'sal','1', 'ADMIN SALE', 'Hung', '03/02/2003',1,null);
INSERT INTO [Staff] VALUES (2,'ser','1', 'ADMIN SERVICE', 'Hung', '03/02/2003',0,null);

GO
---Customer---
insert into Customer values (1, N'', 'Ivy', N'Ivypearl','1', N'', 0917715515,null , 1);
insert into Customer values (2, N'', 'erik', N'eriknguyen','1', N'', 0123456789,null , 1);
insert into Customer values (3, N'', 'jenni', N'haison','1', N'', 0112345678,null , 1);
insert into Customer values (4, N'', 'rien', N'tuananh','1', N'', 234566789,null , 1);
GO
---Voucher---
insert into Voucher values(N'VI1', N'Discount 20% for all service', '2024-05-20', '2024-06-20');
insert into Voucher values(N'VI2', N'Discount 20% for new customer', '2024-05-20', '2024-06-20');
insert into Voucher values(N'VI3', N'Discount 20% for all product', '2024-05-20', '2024-06-20');

GO
---Payment Method ---
insert into PaymentMethod values(1, N'MOMO', 'MOMO-API', 0);
insert into PaymentMethod values(2, 'VNPAY', 'VNPAY-API', 0);
insert into PaymentMethod values(3, 'PAYPAL', 'PAYPAL-API', 0);
GO
---Transaction ---
insert into Transactions values(N'TRI1', 1, '2024-05-22', 1);
insert into Transactions values(N'TRI2', 1, '2024-05-29', 2);
insert into Transactions values(N'TRI3', 1, '2024-05-10', 3);
GO
---Order---
insert into [Order] values (N'OI1', 1, 1, null, '2024-05-23', 1000000,N'VI1', N'TRI1');
insert into [Order] values (N'OI2',  2, 1, null, '2024-05-23', 1203310,N'VI2', N'TRI2');
insert into [Order] values (N'OI3',  null, 1, 1, '2024-05-23', 103000,N'VI3', N'TRI3');

GO
----feedback--
insert into FeedBack values(1, N'OI1', N'Picture Feedback', 5, N'Hài lòng');
insert into FeedBack values(2, N'OI2', N'Picture Feedback', 1, N'Trải nghiệm quá tệ');
insert into FeedBack values(3, N'OI3', N'Picture Feedback', 4, N'Tốt');
GO
--Product Order Detail ---
INSERT INTO [ProductOrderDetails] VALUES (N'POI1', N'OI1', 'PRO01', 1, 100.000, null)
INSERT INTO [ProductOrderDetails] VALUES (N'POI2', N'OI2', 'PRO01', 1, 100.000, null)
INSERT INTO [ProductOrderDetails] VALUES (N'POI3', N'OI3', 'PRO01', 1, 100.000, null)

Go
--PET---
insert into Pet values (1, 1, 'LULU', N'Poodle nau xam', 'male', 'Poodle', 2.1);
insert into Pet values (2, 2, 'LALA', N'Phốc sóc trắng xinh', 'female', 'Phốc', 1.5);
insert into Pet values (3, 3, 'GAUGAU', N'Corgi Lùn', 'female', 'Corgi', 1.7);
insert into Pet values (4, 4, 'MIUMIU', N'Mèo Golden xinh', 'male', 'Golden', 2.1);

GO

---Service ---
insert into [Service] values (N'SER1', '', N'Cắt móng - Mài móng',0, 15, '', 50.000,null, null, 1);
insert into [Service] values (N'SER2', '', N'Cắt móng - Mài móng',15, 100, '',70.000,null, null, 1);
insert into [Service] values (N'SER3', '', N'Vệ sinh tai - Nhổ lông tai',0, 15,'',60.000,null, null, 1);
insert into [Service] values (N'SER4', '', N'Vệ sinh tai - Nhổ lông tai',15, 100,'',80.000,null, null, 1);
insert into [Service] values (N'SER5', '', N'Cạo vệ sinh:Bụng, Hậu môn - Lông bàn chân',0, 15,'',70.000,null, null, 1);
insert into [Service] values (N'SER6', '', N'Cạo vệ sinh:Bụng, Hậu môn - Lông bàn chân',15, 100,'',95.000,null, null, 1);
insert into [Service] values (N'SER7', '', N'Cắt tỉa mặt',0, 100,'',50.000,null, null, 1);
insert into [Service] values (N'SER8', '', N'Cắt tỉa mặt',0, 100,'',50.000,null, null, 1);

GO
---Product Order Detail ---
INSERT INTO [ServiceOrderDetails] VALUES (N'SOI1', N'SER1', N'OI1', null,2.1 , 100.000, 1)
INSERT INTO [ServiceOrderDetails] VALUES (N'SOI2', N'SER1', N'OI2', null, 1.5, 100.000, 2)
INSERT INTO [ServiceOrderDetails] VALUES (N'SOI3', N'SER1', N'OI3', null, 1.7, 100.000, 3)
