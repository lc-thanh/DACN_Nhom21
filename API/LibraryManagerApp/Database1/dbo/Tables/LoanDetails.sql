CREATE TABLE [dbo].[LoanDetails] (
    [LoanId]   UNIQUEIDENTIFIER NOT NULL,
    [BookId]   UNIQUEIDENTIFIER NOT NULL,
    [Quantity] INT              NOT NULL,
    CONSTRAINT [PK_LoanDetails] PRIMARY KEY CLUSTERED ([LoanId] ASC, [BookId] ASC),
    CONSTRAINT [FK_LoanDetails_Books_BookId] FOREIGN KEY ([BookId]) REFERENCES [dbo].[Books] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_LoanDetails_Loans_LoanId] FOREIGN KEY ([LoanId]) REFERENCES [dbo].[Loans] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_LoanDetails_BookId]
    ON [dbo].[LoanDetails]([BookId] ASC);

