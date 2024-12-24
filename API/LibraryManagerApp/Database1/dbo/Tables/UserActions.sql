CREATE TABLE [dbo].[UserActions] (
    [Id]         UNIQUEIDENTIFIER NOT NULL,
    [UserId]     UNIQUEIDENTIFIER NOT NULL,
    [ActionName] NVARCHAR (MAX)   NOT NULL,
    [Timestamp]  DATETIME2 (7)    NOT NULL,
    CONSTRAINT [PK_UserActions] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserActions_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_UserActions_UserId]
    ON [dbo].[UserActions]([UserId] ASC);

