CREATE TABLE [dbo].[Books] (
    [Id]                UNIQUEIDENTIFIER NOT NULL,
    [Title]             NVARCHAR (255)   NOT NULL,
    [Publisher]         NVARCHAR (100)   NULL,
    [PublishedYear]     INT              NULL,
    [Quantity]          INT              NOT NULL,
    [AvailableQuantity] INT              NOT NULL,
    [TotalPages]        INT              NOT NULL,
    [ImageUrl]          NVARCHAR (512)   NOT NULL,
    [Description]       NVARCHAR (2000)  NULL,
    [CreatedOn]         DATETIME2 (7)    NOT NULL,
    [AuthorName]        NVARCHAR (MAX)   NULL,
    [CategoryId]        UNIQUEIDENTIFIER NULL,
    [BookShelfId]       UNIQUEIDENTIFIER NULL,
    CONSTRAINT [PK_Books] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Books_BookShelves_BookShelfId] FOREIGN KEY ([BookShelfId]) REFERENCES [dbo].[BookShelves] ([Id]) ON DELETE SET NULL,
    CONSTRAINT [FK_Books_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [dbo].[Categories] ([Id]) ON DELETE SET NULL
);


GO
CREATE NONCLUSTERED INDEX [IX_Books_BookShelfId]
    ON [dbo].[Books]([BookShelfId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Books_CategoryId]
    ON [dbo].[Books]([CategoryId] ASC);

