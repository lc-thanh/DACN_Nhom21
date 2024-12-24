CREATE TABLE [dbo].[BookShelves] (
    [Id]        UNIQUEIDENTIFIER NOT NULL,
    [Name]      NVARCHAR (50)    NOT NULL,
    [CreatedOn] DATETIME2 (7)    NOT NULL,
    [CabinetId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_BookShelves] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_BookShelves_Cabinets_CabinetId] FOREIGN KEY ([CabinetId]) REFERENCES [dbo].[Cabinets] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_BookShelves_CabinetId]
    ON [dbo].[BookShelves]([CabinetId] ASC);

