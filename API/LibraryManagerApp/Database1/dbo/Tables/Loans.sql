CREATE TABLE [dbo].[Loans] (
    [Id]           UNIQUEIDENTIFIER NOT NULL,
    [LoanCode]     NVARCHAR (450)   NOT NULL,
    [LoanDate]     DATETIME2 (7)    NOT NULL,
    [DueDate]      DATETIME2 (7)    NOT NULL,
    [ReturnedDate] DATETIME2 (7)    NULL,
    [Status]       INT              NOT NULL,
    [MemberId]     UNIQUEIDENTIFIER NOT NULL,
    [LibrarianId]  UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_Loans] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Loans_Users_LibrarianId] FOREIGN KEY ([LibrarianId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_Loans_Users_MemberId] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Users] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [IX_Loans_LibrarianId]
    ON [dbo].[Loans]([LibrarianId] ASC);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_Loans_LoanCode]
    ON [dbo].[Loans]([LoanCode] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Loans_MemberId]
    ON [dbo].[Loans]([MemberId] ASC);

