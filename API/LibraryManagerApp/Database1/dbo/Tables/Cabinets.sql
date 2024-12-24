CREATE TABLE [dbo].[Cabinets] (
    [Id]        UNIQUEIDENTIFIER NOT NULL,
    [Name]      NVARCHAR (50)    NOT NULL,
    [Location]  NVARCHAR (50)    NULL,
    [CreatedOn] DATETIME2 (7)    NOT NULL,
    CONSTRAINT [PK_Cabinets] PRIMARY KEY CLUSTERED ([Id] ASC)
);

