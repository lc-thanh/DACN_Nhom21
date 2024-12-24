CREATE TABLE [dbo].[UserTokens] (
    [Id]           UNIQUEIDENTIFIER NOT NULL,
    [UserId]       UNIQUEIDENTIFIER NOT NULL,
    [RefreshToken] NVARCHAR (MAX)   NOT NULL,
    [ExpiresAt]    DATETIME2 (7)    NOT NULL,
    [CreatedAt]    DATETIME2 (7)    NOT NULL,
    CONSTRAINT [PK_UserTokens] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserTokens_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_UserTokens_UserId]
    ON [dbo].[UserTokens]([UserId] ASC);

