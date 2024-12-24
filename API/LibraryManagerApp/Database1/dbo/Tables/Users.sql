CREATE TABLE [dbo].[Users] (
    [Id]            UNIQUEIDENTIFIER NOT NULL,
    [FullName]      NVARCHAR (100)   NOT NULL,
    [Email]         NVARCHAR (255)   NULL,
    [Phone]         NVARCHAR (12)    NOT NULL,
    [Address]       NVARCHAR (255)   NULL,
    [DateOfBirth]   DATETIME2 (7)    NULL,
    [Password]      NVARCHAR (MAX)   NOT NULL,
    [Role]          INT              NOT NULL,
    [CreatedOn]     DATETIME2 (7)    NOT NULL,
    [Discriminator] NVARCHAR (MAX)   NOT NULL,
    [IndividualId]  NVARCHAR (10)    NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_Users_IndividualId]
    ON [dbo].[Users]([IndividualId] ASC) WHERE ([IndividualId] IS NOT NULL);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_Users_Phone]
    ON [dbo].[Users]([Phone] ASC);

